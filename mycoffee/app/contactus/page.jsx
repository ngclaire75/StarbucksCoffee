import ComingSoon from "../components/ComingSoon";

export const metadata = {
  title: "Contact Us — Starbucks",
};

const icon = (
  <g transform="translate(40 40) scale(1.5) translate(-12 -12)" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="22,6 12,13 2,6"/>
  </g>
);

export default function ContactUsPage() {
  return <ComingSoon title="Contact Us" icon={icon} />;
}
