function Limb({ limb, limbHurt }) {
  return (
    <div className={`limb ${limb}`}>
      <img
        src={`./pipboy/${limb.toLowerCase()}/${limbHurt ? "hurt" : "full"}${
          limb.charAt(0).toUpperCase() + limb.slice(1)
        }.png`}
        alt={`${limb}`}
      />
    </div>
  );
}

export default Limb;
