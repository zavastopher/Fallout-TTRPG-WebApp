function Description({ items, currentItem }) {
  return (
    <div>
      <h3>{items[currentItem].name}</h3>
      <p>{items[currentItem].description}</p>
      <p>
        {items[currentItem].quantity != null &&
          `Quantity: ${items[currentItem].quantity}`}
      </p>
    </div>
  );
}

export default Description;
