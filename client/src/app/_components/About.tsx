import { Clock, Send, Shield } from "lucide-react";

const features = [
  {
    title: "Instant File Sharing",
    description:
      "Effortlessly share files with anyone using direct links or email invitations.",
    icon: <Send className="text-accent size-6" />,
  },

  {
    title: "Secure Cloud Storage",
    description:
      "Keep your files safe with encrypted cloud storage and access controls.",
    icon: <Shield className="text-accent size-6" />,
  },
  // {
  //   title: "Cross-Platform Access",
  //   description:
  //     "Access your files from any device, whether mobile, desktop, or tablet.",
  //   icon: <DeviceTablet className="text-accent size-6" />,
  // },
  {
    title: "Version History",
    description:
      "Track changes and restore previous versions of your files effortlessly.",
    icon: <Clock className="text-accent size-6" />,
  },
];

export default function Features() {
  return (
    <section className="sm:px-10 px-5 py-5">
      <div className="flex gap-10 flex-wrap items-center">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm border w-sm border-neutral/20"
          >
            <div className="bg-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
