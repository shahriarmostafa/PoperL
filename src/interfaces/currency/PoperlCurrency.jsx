import React, { useState, useEffect } from "react";
import "./PoperlCurrency.css";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
export default function PoperlCurrency() {
  const [value, setValue] = useState(0);
  const axiosSecure = useAxiosSecure();

  const handleChange = (amount) => {
    setValue((prev) => prev + amount);
  };

  useEffect(() => {
  axiosSecure.get("/point-value").then((res) => {
    setValue(res.data.pointValue);
  });
}, []);

  return (
    <div className="crypto-page d-flex flex-column align-items-center justify-content-center">
      {/* Big Fractional Number */}
      <h1 className="crypto-number">
        {value.toLocaleString("en-US", { minimumFractionDigits: 8 })}
      </h1>

      <div className="tables row w-100 mt-5">
        {/* Table 1 */}
        <div className="col-md-6 mb-4">
          <table className="table table-dark table-bordered crypto-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Add Small</td>
                <td>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => handleChange(0.0001)}
                  >
                    +0.0001
                  </button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>

        {/* Table 2 */}
        <div className="col-md-6 mb-4">
          <table className="table table-dark table-bordered crypto-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Subtract Small</td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleChange(-0.0001)}
                  >
                    -0.0001
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
