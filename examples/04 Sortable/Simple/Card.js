import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';

const style = {
  border: '1px solid gray',
  padding: '0.5rem 1rem',
  marginBottom: '6px',
  backgroundColor: 'white',
  cursor: 'move',
  height: 70,
  overflow: 'hidden',
};

const cardSource = {
  beginDrag(props) {
    props.setWillDropIndex(props.index);
    return {
      id: props.id,
      index: props.index,
      parent: props.parent,
    };
  },
  endDrag(props) {
    props.setWillDropIndex(null);
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const beforeHoverClientY = props.hoverClientY;
    const hoverIndex = props.index;
    const targetParent = props.parent;

    // console.log('getSourceClientOffset:');
    // console.log(monitor.getSourceClientOffset());
    // console.log('getInitialSourceClientOffset:');
    // console.log(monitor.getInitialSourceClientOffset());

    // Don't replace items with themselves
    // if (dragIndex === hoverIndex) {
    //   return;
    // }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // const parentOffset = findDOMNode(component).parentNode.getBoundingClientRect();
    // console.log(hoverBoundingRect);

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (beforeHoverClientY < hoverClientY && hoverClientY < hoverMiddleY) {
      props.setWillDropIndex(hoverIndex - 1);
      return;
    }

    // Dragging upwards
    if (beforeHoverClientY > hoverClientY && hoverClientY > hoverMiddleY) {
      props.setWillDropIndex(hoverIndex + 1);
      return;
    }


    // Dragging downwards
    if (beforeHoverClientY < hoverClientY) {
      props.setWillDropIndex(hoverIndex);
      props.showDivider(targetParent, hoverBoundingRect.left - 10, window.scrollY + hoverBoundingRect.top + 72, hoverClientY);
    } else if (beforeHoverClientY > hoverClientY) {
      props.setWillDropIndex(hoverIndex);
      props.showDivider(targetParent, hoverBoundingRect.left - 10, window.scrollY + hoverBoundingRect.top - 4, hoverClientY);
    }


    // Time to actually perform the action

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // monitor.getItem().index = hoverIndex;
  },
  drop(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const sourceParent = monitor.getItem().parent;
    const targetParent = props.parent;
    props.dropCard(dragIndex, hoverIndex, targetParent, sourceParent);
  }
};

// @DropTarget(ItemTypes.CARD, cardTarget, connect => ({
//   connectDropTarget: connect.dropTarget()
// }))
// @DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
//   connectDragSource: connect.dragSource(),
//   isDragging: monitor.isDragging()
// }))
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    showDivider: PropTypes.func.isRequired,
    dropCard: PropTypes.func.isRequired,
    showPlaceholder: PropTypes.bool,
    hoverIndex: PropTypes.number,
    setWillDropIndex: PropTypes.func,
  };

  render() {
    const { text, isDragging, connectDragSource, connectDropTarget, isOver, showPlaceholder } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div style={{ ...style, opacity }}>
        {text}
      </div>
    ));
  }
}

export default flow(
  DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }))
)(Card);
