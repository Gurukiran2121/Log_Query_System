import {
  DatePicker,
  Flex,
  Input,
  Layout,
  Select,
  Spin,
  Typography,
  List,
  Space,
} from "antd";
import VirtualList from "rc-virtual-list";
import { debounce } from "lodash";
import styles from "./LogsQueryLayout.module.scss";
import React, { useEffect, useMemo, useState } from "react";
import useLogs, { type Logs } from "../store/useLogs";
import type { RangePickerProps } from "antd/es/date-picker";

const { Sider, Header, Content } = Layout;

const levelOptions = [
  { label: "Error", value: "error" },
  { label: "Warning", value: "warn" },
  { label: "Info", value: "info" },
];

const searchByOptions = [
  { label: "Resource ID", value: "resourceId" },
  {
    label: "Message",
    value: "message",
  },
];

//TODO : --- have to handle dateRange in unix for efficient querying

const LogsQueryLayout = () => {
  const [level, setLevel] = useState<string[] | null>(null);
  const [searchBy, setSearchBy] = useState<string | null>("message");
  const [spanId, setSelectedSpanId] = useState<string[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<RangePickerProps["value"]>(null);
  const { isLogsLoading, fetchLogs, error, logs, totalLogs, spanIdOptions } =
    useLogs();

  const handleLevelChange = (value: string[]) => {
    setLevel(value);
  };

  const handleSearchByOptionChange = (value: string) => {
    setSearchBy(value);
  };

  const handleSpanIdChange = (value: string[]) => {
    setSelectedSpanId(value);
  };

  const debounceFetch = useMemo(
    () =>
      debounce((filters) => {
        fetchLogs(filters);
      }, 500),
    []
  );

  const handleSearchLogs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateRangeChange: RangePickerProps["onChange"] = (dates) => {
    setDateRange(dates);
  };

  //filters api call
  useEffect(() => {
    const filters: Record<string, string> = {};
    if (searchBy && searchTerm) {
      filters[searchBy] = searchTerm.trim();
    }
    if (spanId && spanId?.length > 0) {
      filters.spanId = spanId.join(",");
    }
    if (level && level.length > 0) {
      filters.level = level.join(",");
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      filters.timestamp_start = dateRange[0].toISOString();
      filters.timestamp_end = dateRange[1].toISOString();
    }
    debounceFetch(filters);
  }, [searchTerm, searchBy, debounceFetch, spanId, level, dateRange]);

  const renderDescription = (
    message: string,
    resourceId: string,
    spanId: string,
    timestamp: string
  ) => {
    return (
      <Flex vertical>
        <Flex vertical>
          <Space>{message}</Space>
          <Space>
            <Typography.Text strong>Resource ID :</Typography.Text>
            <Space>{resourceId}</Space>
          </Space>
          <Space>
            <Typography.Text strong>Span ID :</Typography.Text>
            <Space>{spanId}</Space>
          </Space>
          <Space>{new Date(timestamp).toDateString()}</Space>
        </Flex>
      </Flex>
    );
  };

  if (error) {
    return <>Error while fetching logs...</>;
  }

  return (
    <Spin spinning={isLogsLoading}>
      <Layout className={styles["logs-page"]}>
        <Header className={styles["page-header"]}>
          <Typography.Title className={styles.logo} level={2}>
            Log Viewer
          </Typography.Title>
        </Header>
        <Layout>
          <Sider width={350} theme="light" className={styles["filter-sider"]}>
            <Flex vertical gap={24}>
              <Flex vertical>
                <Typography.Text strong className={styles.label}>
                  Level
                </Typography.Text>
                <Select
                  className={styles["multi-select"]}
                  mode="multiple"
                  options={levelOptions}
                  placeholder="Select levels"
                  value={level}
                  onChange={handleLevelChange}
                />
              </Flex>
              <Flex vertical>
                <Typography.Text strong className={styles.label}>
                  Span Id
                </Typography.Text>
                <Select
                  className={styles["multi-select"]}
                  mode="multiple"
                  options={spanIdOptions}
                  placeholder="Select Span Id"
                  defaultValue={null}
                  value={spanId}
                  onChange={handleSpanIdChange}
                />
              </Flex>
            </Flex>
          </Sider>
          <Content className={styles["log-viewer-list-layout"]}>
            <Flex vertical gap={32}>
              <Flex className={styles["search-box"]} gap={12} align="center">
                <Select
                  options={searchByOptions}
                  value={searchBy}
                  placeholder="Search By"
                  className={styles["select-by-options"]}
                  onChange={handleSearchByOptionChange}
                ></Select>
                <Input.Search
                  variant="borderless"
                  placeholder="Search logs"
                  value={searchTerm}
                  onChange={handleSearchLogs}
                />
                <DatePicker.RangePicker
                  value={dateRange}
                  rootClassName={styles["range-picker"]}
                  variant="borderless"
                  size="large"
                  onChange={handleDateRangeChange}
                />
              </Flex>

              <Flex vertical gap={24}>
                <Flex justify="space-between" align="center">
                  <Typography.Title level={5}>
                    Total Logs : {totalLogs}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    Showing {logs.length} results
                  </Typography.Title>
                </Flex>

                <Flex
                  gap={12}
                  vertical
                  className={styles["logs-details-container"]}
                >
                  {logs.length > 0 ? (
                    <List>
                      <VirtualList
                        data={logs}
                        itemKey="id"
                        itemHeight={47}
                        height={600}
                      >
                        {(item: Logs) => (
                          <List.Item key={item.id}>
                            <List.Item.Meta
                              title={item.level}
                              description={renderDescription(
                                item.message,
                                item.resourceId,
                                item.spanId,
                                item.timestamp
                              )}
                            />
                          </List.Item>
                        )}
                      </VirtualList>
                    </List>
                  ) : (
                    <Typography.Text>No logs found...</Typography.Text>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Content>
        </Layout>
      </Layout>
    </Spin>
  );
};

export default LogsQueryLayout;
