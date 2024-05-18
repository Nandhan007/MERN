import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

Metadata.propTypes = {
  title: PropTypes.string.isRequired,
};

export default function Metadata({ title }) {
  return (
    <Helmet>
      <title>{`${title} - Amazon-Cart`}</title>
    </Helmet>
  );
}
