import {
  getShipment,
  compShipment,
  startShipment,
  avatar,
} from "@/public/Images";
import Image from "next/image";

interface ServicesProps {
  setOpenProfile: (open: boolean) => void;
  setCompleteModal: (open: boolean) => void;
  setStartModal: (open: boolean) => void;
  setGetModal: (open: boolean) => void;
}

const Services = ({
  setOpenProfile,
  setCompleteModal,
  setStartModal,
  setGetModal,
}: ServicesProps) => {
  const services = [
    {
      image: startShipment,
      title: "Start Shipment",
      description: "Initiate a new shipment.",
      modalType: "start",
    },
    {
      image: getShipment,
      title: "Get Shipment",
      description: "Retrieve information about your shipments.",
      modalType: "get",
    },
    {
      image: compShipment,
      title: "Complete Shipment",
      description: "Mark your shipments as complete.",
      modalType: "complete",
    },
    {
      image: avatar,
      title: "Avatar",
      description: "Customize your profile with an avatar.",
      modalType: "profile",
    },
  ];

  const openModalBox = (modalType: string) => {
    switch (modalType) {
      case "complete":
        setCompleteModal(true);
        break;
      case "start":
        setStartModal(true);
        break;
      case "get":
        setGetModal(true);
        break;
      case "profile":
        setOpenProfile(true);
        break;
      default:
        break;
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive services to manage your shipments
            effectively and efficiently.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => openModalBox(service.modalType)}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              <div className="p-5 flex-grow flex flex-col items-center text-center">
                <div className="mb-4 w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow">
                  {service.description}
                </p>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Learn more →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
