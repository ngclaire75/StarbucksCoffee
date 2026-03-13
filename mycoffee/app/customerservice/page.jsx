import ComingSoon from "../components/ComingSoon";

export const metadata = {
  title: "Customer Service — Starbucks",
};

const icon = (
  <g transform="translate(40 40) scale(1.5) translate(-12 -12)" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0118 0v6"/>
    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z"/>
    <path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"/>
  </g>
);

export default function CustomerServicePage() {
  return <ComingSoon title="Customer Service" icon={icon} />;
}
