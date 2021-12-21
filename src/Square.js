function Square(props) {
  return (
    <div className={'square '} {...props} style={{cursor:"pointer"}}>{props.x ? 'x' : (props.o ? 'o' : '')}</div>
  );
}

export default Square;