"use client";
import OrderHeader from "@/components/Orders/OrderHeader";
import OrderTable from "@/components/Orders/OrderTable";
import { fetchAllOrder } from "@/store/orderAPI";
import { Fragment, useEffect, useState } from "react";
import Socket from "@/components/Socket/socket";

const OrdersHistory = () => {
  const [data, setData] = useState([]);
  const loadData = async () => {
    const orders = await fetchAllOrder();
    setData(orders);
  };
  useEffect(() => {
    loadData();
  }, []);

  // socket connection status logging
  useEffect(() => {
    Socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    Socket.on("admin-order-updated", (updatedOrder) => {
      console.log("Received order update:", updatedOrder);
      setData((prevData) =>
        prevData.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    });

    Socket.on("new-order", (order) => {
      console.log("Received new order:", order);
      setData((prevData) => [order, ...prevData]);
    });

    Socket.on("admin-order-cancelled", (cancelledOrder) => {
      setData((prevData) => prevData.filter((order) => order._id !== cancelledOrder._id));
    });

    Socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      Socket.off("admin-order-updated");
      Socket.off("new-order");
      Socket.off("admin-order-cancelled");
    };
  }, []);

  return (
    <Fragment>
      <OrderHeader onAddData={loadData} />
      {data.length <= 0 ? (
        <div className="w-full bg-white shadow h-[calc(100vh-20rem)] flex justify-center items-center rounded-md">
          <h1 className="text-lg text-gray-700">No data to display.</h1>
        </div>
      ) : (
        <OrderTable orders={data} />
      )}
    </Fragment>
  );
};
export default OrdersHistory;
