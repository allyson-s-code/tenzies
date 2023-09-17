import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  const pips = Array(props.value)
    .fill(0)
    .map((pip, i) => <span key={i} className="pip"></span>);

  return (
    <div className="die-face" onClick={props.holdDice} style={styles}>
      {pips}
    </div>
  );
}
