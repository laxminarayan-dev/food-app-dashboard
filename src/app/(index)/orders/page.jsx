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
    if (Socket.connected) {
      console.log("Already connected to Socket.IO server");
    } else {
      Socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });
    }
    Socket.on("new-order", (order) => {
      console.log("Received new order:", order);
      setData((prevData) => [order, ...prevData]);
    });

    Socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
  }, []);

  useEffect(() => {
    if (Socket.connected) {
      console.log("Already connected to Socket.IO server");
    } else {
      Socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });
    }

    Socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
  }, []);

  return (
    <Fragment>
      <OrderHeader onAddData={loadData} />
      {data.length <= 0 ? (
        <div className="w-[38rem] bg-white shadow h-80 flex justify-center items-center rounded-md">
          <h1 className="text-lg text-gray-700">No data to display.</h1>
        </div>
      ) : (
        <OrderTable orders={data} />
      )}
    </Fragment>
  );
};
export default OrdersHistory;
