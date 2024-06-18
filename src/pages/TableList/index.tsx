import {
  Button,
  DatePicker,
  Input,
  Radio,
  RadioChangeEvent,
  Select,
  Table,
  message
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import moment from 'moment';
import { history } from '@umijs/max';
import { GET_DATA, GET_LEVEL } from '../../api/index';
import { SettingOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const TableList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isActive, setIsActive] = useState(null as any);
  const [variablesData, setVariablesData] = useState({ page, pageSize } as any);

  const { data, loading, error, updateQuery } = useQuery(GET_DATA, {
    variables: variablesData
  });

  const dateOptions = {
    dateStyle: 'short',
    timeStyle: 'short'
  } as Intl.DateTimeFormatOptions;

  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !error && data) {
      console.log(data);
      setDataSource(data.Airdrops);
    }
  }, [data, loading, error]);

  useEffect(() => {
    console.log(variablesData);

    updateQuery((data) => {
      const newData = {};
      console.log(data);
      return {
        ...data,
        ...newData
      };
    });
  }, [variablesData]);
  const [getLeavelFnc] = useLazyQuery(GET_LEVEL);

  const getLevelInit = ()=>{
    const token = localStorage.getItem('token')
    getLeavelFnc({
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }).then((levelData)=>{
      if(!levelData?.data?.getAddressLevel||levelData?.data?.getAddressLevel==='0'){
        message.error('No permission')

        setTimeout(() => {
          localStorage.clear()
          history.push('/user/login')
        }, 1000);
      }
    })
    
  
      
  }
  useEffect(()=>{
    getLevelInit()
  },[])

  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, data: any) => {
        return (
          <a
            href={`https://akiprotocol.io/airdrop/claim/${data.airdrop_id}`}
            target="_blank"
            rel="noreferrer"
          >
            {data.title}
          </a>
        );
      }
    },
    {
      title: 'Campaign Time',
      dataIndex: 'Time',
      key: 'Time',
      render: (_: any, data: any) => {
        return (
          <p>
            {new Date(data.start_date).toLocaleString(undefined, dateOptions) +
              ' - ' +
              new Date(data.end_date).toLocaleString(undefined, dateOptions)}
          </p>
        );
      }
    },
    {
      title: 'Timestamp',
      dataIndex: 'Timestamp',
      key: 'Timestamp',
      render: (_: any, data: any) => {
        return (
          <p>
            {new Date(data.updateTime).toLocaleString(undefined, dateOptions)}
          </p>
        );
      }
    },
    {
      title: 'Visitors',
      dataIndex: 'Visitors',
      key: 'Visitors',
      render: (_: any, data: any) => {
        return <p>{data.visitors}</p>;
      }
    },
    {
      title: 'Visitor Increase',
      dataIndex: 'VisitorIncrease',
      key: 'VisitorIncrease',
      render: (_: any, data: any) => {
        return <p>{data.visitorsGrowth}</p>;
      }
    },
    {
      title: 'Conversions',
      dataIndex: 'Conversions',
      key: 'Conversions',
      render: (_: any, data: any) => {
        return <p>{data.conversions}</p>;
      }
    },
    {
      title: 'Conversion Increase',
      dataIndex: 'ConversionIncrease',
      key: 'ConversionIncrease',
      render: (_: any, data: any) => {
        return <p>{data.conversionIncrease}</p>;
      }
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'ConversionRate',
      key: 'ConversionRate',
      render: (_: any, data: any) => {
        return <p>{data.conversionRate}</p>;
      }
    },
    {
      title: 'Listing Status',
      dataIndex: 'Listing Status',
      key: 'Listing Status',
      render: (_: any, data: any) => {
        return (
          <p>
            {data.isOfficial
              ? 'workshop'
              : data.listed
              ? 'trending'
              : 'Not listed'}
          </p>
        );
      }
    },
    {
      title: 'Conversion Rate Increase',
      dataIndex: 'Conversion Rate Increase',
      key: 'Conversion Rate Increase',
      render: (_: any, data: any) => {
        return <p>{data.conversionRateGrowthRate}</p>;
      }
    },
    {
      title: 'Micro-influencers',
      dataIndex: 'Micro-influencers',
      key: 'Micro-influencers',
      render: (_: any, data: any) => {
        return <p>{data.microInfluencers}</p>;
      }
    },
    {
      title: 'Referred Visitors',
      dataIndex: 'ReferredVisitors',
      key: 'ReferredVisitors',
      render: (_: any, data: any) => {
        return <p>{data.referredVisitors}</p>;
      }
    },
    {
      title: 'Referred Conversions',
      dataIndex: 'ReferredConversions',
      key: 'ReferredConversions',
      render: (_: any, data: any) => {
        return <p>{data.referredConversions}</p>;
      }
    },
    {
      title: 'Most Referral Wallet',
      dataIndex: 'Most Referral Wallet',
      key: 'Most Referral Wallet',
      render: (_: any, data: any) => {
        return (
          <p>
            {data.referralInfo.length > 0
              ? data.referralInfo[0].referralNumber > 0
                ? data.referralInfo[0].wallet
                : '--'
              : '--'}
          </p>
        );
      }
    },
    {
      title: 'Most Referral X',
      dataIndex: 'Most Referral X',
      key: 'Most Referral X',
      render: (_: any, data: any) => {
        return (
          <p>
            {data.referralInfo.length > 0
              ? data.referralInfo[0].referralNumber > 0
                ? data.referralInfo[0].twitter
                : '--'
              : '--'}
          </p>
        );
      }
    },
    {
      title: 'Most Referral Count',
      dataIndex: 'Most Referral Count',
      key: 'Most Referral Count',
      render: (_: any, data: any) => {
        return (
          <p>
            {data.referralInfo.length > 0
              ? data.referralInfo[0].referralNumber
              : '--'}
          </p>
        );
      }
    },
    {
      title: 'More',
      dataIndex: 'more',
      key: 'more',
      render: (_: any, data: any) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              history.push('/detailsList?id=' + data.airdrop_id);
            }}
          >
            More
          </Button>
        );
      }
    }
  ];

  const { RangePicker } = DatePicker;

  const handleDateOk = (selectedDates: any) => {
    if (selectedDates && selectedDates.length === 2) {
      const [startDate, endDate] = selectedDates;
      const formattedStartDate = moment(startDate).toISOString(); // 格式化开始日期
      const formattedEndDate = moment(endDate).toISOString(); // 格式化结束日期
      setVariablesData({
        ...variablesData,
        start_date: formattedStartDate,
        end_date: formattedEndDate
      });
    }
  };
  const RadioOnChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setVariablesData({
      ...variablesData,
      is_active: e.target.value
    });
    setIsActive(e.target.value);
  };
  const defaultCheckedList = columns.map((item) => item.key as string);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key as string)
  }));
  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key
  }));

  const { Option } = Select;

  const selectRef = useRef(null); // 创建引用以控制Select的展开
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const onIconClick = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  const handleExport = () => {
    // 将数据转化为工作表
    const ws = XLSX.utils.json_to_sheet(data.Airdrops);

    // 创建工作簿并添加工作表
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 生成Excel文件并导出
    // 使用blob以支持大数据量的下载
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // 字符串转为ArrayBuffer
    function s2ab(s: any) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }

    // 创建隐藏的链接并触发下载
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaigns.xlsx';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div>
      <div className="tableSerch">
        <div className="tableSerchSellBox">
          <div className="tableSerchSell">
            <p>Campaign Id</p>
            <Input
              onChange={(e) => {
                setVariablesData({
                  ...variablesData,
                  id: e.target.value
                });
              }}
              placeholder="Campaign Id"
            />
          </div>
          <div className="tableSerchSell">
            <p>Campaign Name</p>
            <Input
              onChange={(e) => {
                setVariablesData({
                  ...variablesData,
                  name: e.target.value
                });
              }}
              placeholder="Campaign Name"
            />
          </div>
          <div className="tableSerchSell">
            <p>Campaign time</p>
            <RangePicker onChange={handleDateOk} showTime />
          </div>
          <div className="tableSerchSell">
            <p>Status</p>
            <Radio.Group onChange={RadioOnChange} value={isActive}>
              <Radio value={'Completed'}>Completed</Radio>
              <Radio value={'Incomplete'}>Incomplete</Radio>
              <Radio value={'All'}>All</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>
      <div className="settingBox">
        <div>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <SettingOutlined
              onClick={onIconClick}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                zIndex: 1000
              }}
            />
            <Select
              ref={selectRef} // 将创建的引用与Select组件关联
              mode="multiple"
              style={{ width: '100%' }} // 根据需要进行调整
              placeholder="请选择"
              value={checkedList}
              onChange={(value) => {
                setCheckedList(value as string[]);
              }}
              open={isSelectOpen}
              onBlur={() => setIsSelectOpen(false)}
              dropdownMatchSelectWidth={false} // 可设置下拉菜单宽度是否与选择器相同
            >
              {options.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div></div>
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
        </div>
      </div>
      <Table
        className="dataTable"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: dataSource.length > 0 ? dataSource[0].total : 0
        }}
        scroll={{ x: true }}
        loading={loading}
        columns={newColumns}
        dataSource={dataSource}
        onChange={(e) => {
          console.log(e);
          setPage(e.current || 1);
          setPageSize(e.pageSize || 10);
          setVariablesData({
            ...variablesData,
            page: e.current,
            pageSize: e.pageSize
          });
        }}
      />
    </div>
  );
};

export default TableList;
