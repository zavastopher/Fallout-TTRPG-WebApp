function Description({ items, currentItem }) {
  return items !== null && items.length > 0 ? (
    <div>
      <h3>{items[currentItem].name}</h3>
      <p>{items[currentItem].description}</p>
      <p>
        {items[currentItem].quantity != null &&
          `Quantity: ${items[currentItem].quantity}`}
      </p>
    </div>
  ) : (
    <div>No Items</div>
  );
}

export default Description;
