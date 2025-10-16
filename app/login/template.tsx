export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-in fade-in-50 duration-300">{children}</div>;
}
