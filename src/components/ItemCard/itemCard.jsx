import "./itemCard.css";

function ItemCard({ item, onCardClick }) {
  return (
    <li className="card">
      <h2 className="card__name">{item.name}</h2>
      <img
        onClick={() => {
          onCardClick(item);
        }}
        className="card__image"
        src={item.link}
        alt={item.name}
      ></img>
    </li>
  );
}

export default ItemCard;
