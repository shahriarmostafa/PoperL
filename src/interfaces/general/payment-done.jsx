// /payment-done.jsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentDone() {
  const [params] = useSearchParams();
  const order_id = params.get("order_id");

  useEffect(() => {
    const finalize = async () => {
      const response = await fetch("https://backend-yege.onrender.com/finalize-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id }),
      });

      const res = await response.json();
      if (response.ok) {
        // Deep link back to app
        window.location.href = "poperl://subscription-success";
      } else {
        alert("Subscription failed: " + res.error);
      }
    };

    if (order_id) finalize();
  }, [order_id]);

  return <h2>Finalizing your subscription...</h2>;
}
