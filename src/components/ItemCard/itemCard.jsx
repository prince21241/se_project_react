import "./itemCard.css";

function itemCard({ item }) {
  return (
    <li className="card">
      <h2 className="card__name">{item.name}</h2>
      <img className="card__image" src={item.link} alt={item.name}></img>
    </li>
  );
}

export default itemCard;
