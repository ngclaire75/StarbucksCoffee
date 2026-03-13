import ComingSoon from "../components/ComingSoon";

export const metadata = {
  title: "About Starbucks",
};

const icon = (
  <g transform="translate(40 40) scale(1.5) translate(-12 -12)" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/>
  </g>
);

export default function AboutStarbucksPage() {
  return <ComingSoon title="About Starbucks" icon={icon} />;
}
