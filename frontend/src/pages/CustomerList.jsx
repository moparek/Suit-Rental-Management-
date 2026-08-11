import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { FaEdit, FaTrash, FaPlus, FaHistory } from "react-icons/fa";

const PAGE_SIZE = 8;

function formatCustomerId(customer) {
  if (!customer?.idType) return "-";
  return customer.idType === "passport" ? "Passport" : "National ID";
}

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [historyCustomer, setHistoryCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await customerAPI.getAll();
      setCustomers(res.data.customers || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async () => {
    try {
      await customerAPI.delete(deleteId);
      setSuccess("Customer deleted successfully");
      setDeleteId(null);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete customer");
      setDeleteId(null);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      formatCustomerId(c).toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">Customers</h3>
        <Link
          to="/customers/add"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <FaPlus /> Add Customer
        </Link>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <div className="card p-3 mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, or phone..."
        />
      </div>

      {loading ? (
        <Loader text="Loading customers..." />
      ) : paginated.length === 0 ? (
        <div className="card p-5 text-center text-muted">
          No customers found.
        </div>
      ) : (
        <div className="card p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>ID</th>
                  <th>Address</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c._id}>
                    <td>{c.fullName}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td><code>{formatCustomerId(c)}</code></td>
                    <td>{c.address}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => setHistoryCustomer(c)}
                        title="View rental history"
                      >
                        <FaHistory />
                      </button>
                      <Link
                        to={`/customers/edit/${c._id}`}
                        className="btn btn-sm btn-outline-primary me-1"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(c._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal
        show={!!deleteId}
        title="Delete Customer"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      >
        Are you sure you want to delete this customer? This action cannot be
        undone.
      </Modal>

      <Modal
        show={!!historyCustomer}
        title={`Rental History - ${historyCustomer?.fullName || ""}`}
        onClose={() => setHistoryCustomer(null)}
      >
        {historyCustomer?.rentalHistory?.length ? (
          <ul className="list-group">
            {historyCustomer.rentalHistory.map((r, i) => (
              <li className="list-group-item" key={i}>
                {r.suitName} — {r.status}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mb-0">No rental history available.</p>
        )}
      </Modal>
    </div>
  );
}

export default CustomerList;
