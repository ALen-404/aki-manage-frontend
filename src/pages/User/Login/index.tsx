import { Footer } from '@/components';
import { SelectLang } from '@umijs/max';
import React from 'react';
import { createStyles } from 'antd-style';
import {  WagmiProvider } from 'wagmi';
import { config } from '../../../wagmiConfig';
import { LoginForm } from '@ant-design/pro-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletOptions } from './compoments/walletSelect';
import CustomApolloProvider from '../../../config/apolloClient';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive
      }
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover
      }
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%'
    }
  };
});

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};
const queryClient = new QueryClient()

const Login: React.FC = () => {
  // const [type, setType] = useState<string>('account');
  const { styles } = useStyles();


  return (
    <div className={styles.container}>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0'
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw'
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Aki Network"
          subTitle={' '}
          initialValues={{
            autoLogin: true
          }}
          submitter={false}
        >
          <WalletOptions></WalletOptions>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
const InitLogin: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CustomApolloProvider>
        <Login></Login>
        </CustomApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default InitLogin;
