import { Button, Select, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {  useQuery } from '@apollo/client';
// import moment from 'moment';
import { GET_DATA } from '@/api';
import { SettingOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';




const TableList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortColKey, setSortColKey] = useState('');
    const [sortType, setSortType] = useState('');
    // const [isActive, setIsActive] = useState(null as any);
    const [variablesData, setVariablesData] = useState({ page, pageSize } as any);

    const { data, loading, error, updateQuery } = useQuery(GET_DATA, {
        variables: variablesData
    });


    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        if (!loading && !error && data) {
            // console.log(data);
            setDataSource(data.Airdrops[0]?.referralInfo||[]);
        }
    }, [data, loading, error]);
    function sortByKey(newData: any[], sortColKey: string , sortType: string) {
        return newData.sort((a:any, b) => {
            let valueA = a[sortColKey];
            let valueB = b[sortColKey];
            // 数字的特殊处理，确保能正确排序数字类型
            if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
                valueA = Number(valueA);
                valueB = Number(valueB);
            }
            // string
            if (typeof valueA === 'string' && valueA.includes('%')) {
                valueA = parseFloat(valueA.replace('%', ''));
            }
            if (typeof valueB === 'string' && valueB.includes('%')) {
                valueB = parseFloat(valueB.replace('%', ''));
            }
    
            if (sortType === 'ascend') {
                // 升序排序
                return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0);
            } else if (sortType === 'descend') {
                // 降序排序
                return valueA < valueB ? 1 : (valueA > valueB ? -1 : 0);
            } else {
                return 0;
            }
        });
    }
    useEffect(() => {
      if(sortColKey&&sortType){
        const referData = data?.Airdrops[0]?.referralInfo
        const newData = [...referData]
        const sortedData = sortByKey(newData, sortColKey, sortType); // 以'referralNumber'作为排序依据，'asc'指定升序
        setDataSource(sortedData);
        
      }
    }, [sortColKey,sortType]);
    useEffect(()=>{
        const urlParams = new URL(window.location.href).searchParams;
        if(urlParams.get('id')){
            setVariablesData({
                ...variablesData,
                id: urlParams.get('id')
            })
        }
        
    },[])

    useEffect(() => {
        updateQuery((data) => {
            const newData = {};
            return {
                ...data,
                ...newData,
            };
        });
    }, [variablesData]);

    const columns = [
        {
            title: 'wallet',
            dataIndex: 'wallet',
            key: 'wallet',
        },
        {
            title: 'referralCode',
            dataIndex: 'referralCode',
            key: 'referralCode',
        },
        {
            title: 'referralWallet',
            dataIndex: 'referralWallet',
            key: 'referralWallet',
        },
        {
            title: 'converted',
            dataIndex: 'converted',
            key: 'converted',
        },
        {
            title: 'referralNumber',
            dataIndex: 'referralNumber',
            key: 'referralNumber',
            sorter:true
        },
     
        {
            title: 'convertedNumber',
            dataIndex: 'convertedNumber',
            key: 'convertedNumber',
            sorter:true
        },
        {
            title: 'convertedRate',
            dataIndex: 'convertedRate',
            key: 'convertedRate',
            sorter:true
        },
        {
            title: 'twitter',
            dataIndex: 'twitter',
            key: 'twitter',
        },
    ];

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
      const ws = XLSX.utils.json_to_sheet(dataSource);
  
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
      a.download = 'CampaignDetails.xlsx';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    };
  
    return (
        <div>
            {/* <div className='tableSerch'>
                <div className='tableSerchSellBox'>
                    <div className='tableSerchSell'>
                        <p>Campaign Id</p>
                        <Input onChange={(e) => {
                            setVariablesData({
                                ...variablesData,
                                id: e.target.value
                            })
                        }} placeholder="Campaign Id" />
                    </div>
                    <div className='tableSerchSell'>
                        <p>Campaign time</p>
                        <RangePicker onChange={handleDateOk} showTime />
                    </div>
                    <div className='tableSerchSell'>
                        <p>Status</p>
                        <Radio.Group onChange={RadioOnChange} value={isActive}>
                            <Radio value={'Completed'}>Completed</Radio>
                            <Radio value={'Incomplete'}>Incomplete</Radio>
                            <Radio value={'All'}>All</Radio>
                        </Radio.Group>
                    </div>
                </div>
            </div> */}

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
            <Table className='dataTable'
                pagination={{ current: page, pageSize: pageSize, total: dataSource.length > 0 ? dataSource.length : 0 }}
                scroll={{ x: true }}
                loading={loading}
                columns={newColumns}
                dataSource={dataSource}
                onChange={(e,_,sorter:any) => {
                    setPage(e.current || 1)
                    setPageSize(e.pageSize || 10)
                    setSortColKey(sorter.field)
                    setSortType(sorter.order)
                    setVariablesData({
                        ...variablesData,
                    })
                }}
            />
        </div>
    );
};

export default TableList;
