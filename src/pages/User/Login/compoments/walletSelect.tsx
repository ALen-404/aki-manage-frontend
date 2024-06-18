import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { Connector, useConnect, useAccount, useSignMessage } from 'wagmi';
import { useMutation } from '@apollo/client';
import { LOGIN_TOKEN } from '@/api';
import { history } from '@umijs/max';

function WalletOption({
  connector,
  onConnect
}: {
  connector: Connector;
  onConnect: () => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <Button
      type="default"
      disabled={!ready}
      onClick={onConnect}
      style={{
        marginBottom: '10px',
        display: 'block',
        backgroundColor: ready ? '#52c41a' : '#f0f0f0',
        color: ready ? '#fff' : 'rgba(0, 0, 0, 0.25)',
        borderColor: '#52c41a',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'all 0.3s'
      }}
    >
      {connector.name}
    </Button>
  );
}

export function WalletOptions() {
  const { connectors, connect, status } = useConnect();
  const { address } = useAccount();

  const [modalVisible, setModalVisible] = useState(false);
  const signInfo = useSignMessage();
  const [userAddress, setUserAddress] = useState('');
  const [signature, setSignature] = useState('');
  const [variablesData, setVariablesData] = useState({
    address: userAddress,
    signature
  } as any);
  const showModal = () => {
    if (!address || status !== 'success') {
      setModalVisible(true);
    }
  };

  const handleConnect = (connector: Connector) => {
    connect({ connector });
    setModalVisible(false);
  };
  const [mutateFunction] = useMutation(LOGIN_TOKEN, {
    variables: variablesData
  });

  useEffect(() => {
    if (!address) {
      return;
    }
    if (
      address !== localStorage.getItem('signAddress') &&
      status !== 'pending'
    ) {
      if (!signInfo.isSuccess) {
        signInfo.signMessage({ message: 'login:aki-manage' });
      }
      console.log(signInfo.data, signInfo.isSuccess);
      if (signInfo.isSuccess) {
        setUserAddress(address);
        setSignature(signInfo.data);
        setVariablesData({
          address: address,
          signature: signInfo.data
        });

        setTimeout(() => {
          mutateFunction().then((data) => {
            localStorage.setItem('signAddress', address);
            localStorage.setItem(
              'token',
              data?.data?.verifySignature ? data.data.verifySignature : ''
            );
            setTimeout(() => {
                history.push('/')
            }, 1000);
          });
        }, 2000);
      }
      return;
    }
  }, [status, address, signInfo.data]);

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{
          backgroundColor: '#52c41a',
          borderColor: '#52c41a',
          color: '#fff',
          borderRadius: '5px',
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        {status === 'success'
          ? `${address.slice(0, 4)}...${address.slice(-4)}`
          : 'Login'}
      </Button>
      <Modal
        title="select wallet"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        bodyStyle={{
          backgroundColor: '#fff',
          padding: '20px'
        }}
        style={{
          borderRadius: '10px'
        }}
        centered
      >
        {connectors.map((connector: { uid: React.Key | null | undefined }) => (
          <WalletOption
            key={connector.uid}
            connector={connector}
            onConnect={() => handleConnect(connector)}
          />
        ))}
      </Modal>
    </>
  );
}
