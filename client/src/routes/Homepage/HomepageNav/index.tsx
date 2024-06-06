import "./index.css";

interface Props {
  children: any;
}

const HomePageNav: React.FC<Props> = ({ children }) => (
  <div className="homepage-nav">{children}</div>
);

export default HomePageNav;
