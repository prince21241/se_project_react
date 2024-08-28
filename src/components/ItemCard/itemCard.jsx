function itemCard({ item }) {
  return (
    <div>
      <h2>{item.name}</h2>
      <img src={item.link} alt={item.name}></img>
    </div>
  );
}

export default itemCard;
