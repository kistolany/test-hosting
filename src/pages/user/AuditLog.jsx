import React, { useEffect, useMemo, useState } from "react";
import { Card, Input, Select, Button } from "antd";
import { FileTextOutlined, SearchOutlined, ShoppingCartOutlined, AppstoreOutlined, InboxOutlined, PrinterOutlined } from "@ant-design/icons";
import { readAuditLogs } from "../../utils/auditLogs";

function getModuleIcon(module) {
  switch (String(module || "").toLowerCase()) {
    case "orders":
      return <ShoppingCartOutlined />;
    case "products":
      return <AppstoreOutlined />;
    case "inventory":
      return <InboxOutlined />;
    case "receipts":
      return <PrinterOutlined />;
    default:
      return <FileTextOutlined />;
  }
}

const AuditLog = () => {
  const [logs, setLogs] = useState(() => readAuditLogs());
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const sync = () => setLogs(readAuditLogs());
    window.addEventListener("storage", sync);
    window.addEventListener("app-audit-logs-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("app-audit-logs-updated", sync);
    };
  }, []);

  const filtered = useMemo(() => {
    const key = String(search || "").trim().toLowerCase();
    if (!key) return logs;
    return logs.filter((item) =>
      [item.when, item.who, item.action, item.module, item.description, item.ip]
        .join(" ")
        .toLowerCase()
        .includes(key)
    );
  }, [search, logs]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * rowsPerPage;
  const pagedLogs = filtered.slice(start, start + rowsPerPage);

  const stats = useMemo(() => {
    const creates = filtered.filter((x) => x.action === "Create").length;
    const updates = filtered.filter((x) => x.action === "Update").length;
    const deletes = filtered.filter((x) => x.action === "Delete").length;
    return { total: filtered.length, creates, updates, deletes };
  }, [filtered]);

  const detailLogs = filtered.slice(0, 3);

  return (
    <div className="user-container auditv2-page">
      <div className="user-wrapper">
        <h2 className="auditv2-title">Audit Logs</h2>

        <div className="auditv2-stat-grid">
          <Card className="auditv2-stat-card" bordered={false}>
            <div className="auditv2-stat-head"><span>Total Logs</span><FileTextOutlined /></div>
            <div className="auditv2-stat-value">{stats.total}</div>
          </Card>
          <Card className="auditv2-stat-card" bordered={false}>
            <div className="auditv2-stat-head"><span>Creates</span><FileTextOutlined /></div>
            <div className="auditv2-stat-value">{stats.creates}</div>
          </Card>
          <Card className="auditv2-stat-card" bordered={false}>
            <div className="auditv2-stat-head"><span>Updates</span><FileTextOutlined /></div>
            <div className="auditv2-stat-value">{stats.updates}</div>
          </Card>
          <Card className="auditv2-stat-card" bordered={false}>
            <div className="auditv2-stat-head"><span>Deletes</span><FileTextOutlined /></div>
            <div className="auditv2-stat-value">{stats.deletes}</div>
          </Card>
        </div>

        <Card className="auditv2-table-card" bordered={false}>
          <div className="auditv2-table-head">
            <div>
              <h3>Table Preview</h3>
              <p>{filtered.length} results available</p>
            </div>
            <div className="auditv2-tools">
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="auditv2-search"
                placeholder="Search audit logs..."
                prefix={<SearchOutlined />}
              />
              <div className="auditv2-rows-box">
                <span>ROWS</span>
                <Select
                  value={rowsPerPage}
                  onChange={(val) => {
                    setRowsPerPage(val);
                    setPage(1);
                  }}
                  options={[{ value: 10, label: "10" }, { value: 15, label: "15" }, { value: 20, label: "20" }]}
                  suffixIcon={<span>⌄</span>}
                  bordered={false}
                />
              </div>
            </div>
          </div>

          <div className="auditv2-table-wrap">
            <table className="auditv2-table">
              <thead>
                <tr>
                  <th>WHEN  ↑↓</th>
                  <th>WHO  ↑↓</th>
                  <th>ACTION  ↑↓</th>
                  <th>MODULE  ↑↓</th>
                  <th>DESCRIPTION  ↑↓</th>
                  <th>IP  ↑↓</th>
                </tr>
              </thead>
              <tbody>
                {pagedLogs.map((row) => (
                  <tr key={row.id}>
                    <td>{row.when}</td>
                    <td>{row.who}</td>
                    <td>
                      <span className={`auditv2-action auditv2-action-${row.action.toLowerCase()}`}>{row.action}</span>
                    </td>
                    <td>
                      <span className="auditv2-module">{getModuleIcon(row.module)} {row.module}</span>
                    </td>
                    <td>{row.description}</td>
                    <td>{row.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="auditv2-pagination">
            <span>Showing {filtered.length ? start + 1 : 0}-{Math.min(start + rowsPerPage, filtered.length)} of {filtered.length} results</span>
            <div className="auditv2-pagination-controls">
              <Button disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 2).map((n) => (
                <Button key={n} className={n === safePage ? "active" : ""} onClick={() => setPage(n)}>{n}</Button>
              ))}
              <Button disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </Card>

        <Card className="auditv2-detail-card" bordered={false}>
          <h3>Recent Change Details</h3>
          <div className="auditv2-detail-list">
            {detailLogs.map((item) => (
              <div key={`detail-${item.id}`} className="auditv2-detail-item">
                <div className="auditv2-detail-top">
                  <strong>{item.description}</strong>
                  <span>{item.when.split(", ")[0]} {item.when.split(" ").slice(-2).join(" ")}</span>
                </div>

                {item.before || item.after ? (
                  <div className="auditv2-before-after">
                    <div>
                      <label>Before Value</label>
                      <code className="before">{item.before || "-"}</code>
                    </div>
                    <div>
                      <label>After Value</label>
                      <code className="after">{item.after || "-"}</code>
                    </div>
                  </div>
                ) : (
                  <div className="auditv2-before-after single">
                    <div>
                      <label>After Value</label>
                      <code className="after">{item.after || "-"}</code>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuditLog;
