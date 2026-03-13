import ComingSoon from "../components/ComingSoon";

export const metadata = {
  title: "Order in the App — Starbucks",
};

const icon = (
  <g transform="translate(40 40) scale(1.5) translate(-12 -12)" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </g>
);

export default function OrderInAppPage() {
  return <ComingSoon title="Order in the App" icon={icon} />;
}
