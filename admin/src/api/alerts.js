import axios from "axios";
import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/alerts")
      .then(res => setAlerts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🚨 Alerts</h1>
      <ul>
        {alerts.map(a => (
          <li key={a._id} className="border p-2 my-2">
            {a.message || "⚠️ No message"}
            <br />
            <small>{new Date(a.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
