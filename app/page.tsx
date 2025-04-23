"use client";

import {
  Table,
  Form,
  Services,
  Profile,
  GetShipment,
  CompleteShipment,
  StartShipment,
  Loader,
} from "@/components";
import { useState, useEffect, useContext } from "react";
import { Shipment, TrackingContext } from "@/context/TrackingContext";

export default function Home() {
  const contextValue = useContext(TrackingContext);
  const [createShipmentModal, setCreateShipmentModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const [allShipmentData, setAllShipmentData] = useState<Shipment[] | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (contextValue?.getAllShipments) {
        const data = await contextValue.getAllShipments();
        if (data) setAllShipmentData(data);
      }
    };

    fetchData();
  }, [contextValue]);

  if (!contextValue) {
    return <Loader />;
  }

  const {
    currentUser,
    createShipment,
    completeShipment,
    getShipment,
    startShipment,
    getAllShipmentsCount,
  } = contextValue;

  return (
    <div className="">
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setStartModal={setStartModal}
        setGetModal={setGetModal}
      />
      <Table
        setCreateShipmentModal={setCreateShipmentModal}
        allShipmentData={allShipmentData}
      />
      <Form
        createShipment={createShipment}
        setCreateShipmentModal={setCreateShipmentModal}
        createShipmentModal={createShipmentModal}
      />
      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentUser={currentUser}
        getAllShipmentsCount={getAllShipmentsCount}
      />
      <CompleteShipment
        completeShipment={completeShipment}
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
      />
      <GetShipment
        getShipment={getShipment}
        getModal={getModal}
        setGetModal={setGetModal}
      />
      <StartShipment
        startShipment={startShipment}
        startModal={startModal}
        setStartModal={setStartModal}
      />
    </div>
  );
}
