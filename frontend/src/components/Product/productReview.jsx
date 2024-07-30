import PropTypes from "prop-types";

ProductReview.propTypes = {
  review: PropTypes.array.isRequired,
};

export default function ProductReview({ review }) {
  return (
    <div className="reviews w-75">
      <h3>Others Reviews:</h3>
      <hr />
      {review &&
        review.map((rev, index) => (
          <div className="review-card my-3" key={index}>
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(rev.rating / 5) * 100}%` }}
              ></div>
            </div>
            <p className="review_user">by {rev.user.name}</p>
            <p className="review_comment">{rev.comments}</p>

            <hr />
          </div>
        ))}
    </div>
  );
}
