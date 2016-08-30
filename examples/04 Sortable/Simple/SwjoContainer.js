import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const style = {
  width: 325,
  display: 'inline-block',
  margin: '0 0 0 100px',
};

class Container extends Component {
  constructor(props) {
    super(props);
    this.showDivider = this.showDivider.bind(this);
    this.dropCard = this.dropCard.bind(this);
    this.setWillDropIndex = this.setWillDropIndex.bind(this);
    this.state = {
      cards1: [{
        id: 11,
        text: 'Write a cool JS library'
      }, {
        id: 12,
        text: 'Make it generic enough'
      }, {
        id: 13,
        text: 'Write README'
      }, {
        id: 14,
        text: 'Create some examples'
      }, {
        id: 15,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)'
      }, {
        id: 16,
        text: '???'
      }, {
        id: 17,
        text: 'PROFIT'
      }],
      cards2: [{
        id: 21,
        text: 'Write a cool JS library'
      }, {
        id: 22,
        text: 'Make it generic enough'
      }, {
        id: 23,
        text: 'Write README'
      }, {
        id: 24,
        text: 'Create some examples'
      }, {
        id: 25,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)'
      }, {
        id: 26,
        text: '???'
      }, {
        id: 27,
        text: 'PROFIT'
      }],
      dividerX: 0,
      dividerY: 0,
      hoverClientY: null,
      willDropIndex: null,
    };
  }

  setWillDropIndex(index) {
    console.log(index);
    this.setState({ willDropIndex: index > -1 ? index : 0 });
  }

  showDivider(targetParent, x, y, hoverClientY) {
    const dividerX = x;
    const dividerY = y;
    this.setState({
      dividerX,
      dividerY,
      hoverClientY,
    });
  }

  dropCard(dragIndex, hoverIndex, targetParent, sourceParent) {
    const cards = this.state[sourceParent];
    const dragCard = cards[dragIndex];
    const willDropIndex = this.state.willDropIndex;

    console.log('### dragIndex:', dragIndex);
    // console.log('### hoverIndex:', hoverIndex);
    console.log('### parent:', targetParent);
    if (targetParent !== sourceParent) {
      this.setState(update(this.state, {
        [targetParent]: {
          $splice: [
            [willDropIndex, 0, dragCard]
          ]
        },
        [sourceParent]: {
          $splice: [
            [dragIndex, 1]
          ]
        }
      }));
    } else {
      this.setState(update(this.state, {
        [targetParent]: {
          $splice: [
            [dragIndex, 1],
            [willDropIndex, 0, dragCard]
          ]
        }
      }));
    }
  }

  render() {
    const { cards1, cards2, hoverClientY, dividerX, dividerY, willDropIndex } = this.state;
    return (
      <div>
        <div style={style}>
          {cards1.map((card, i) => {
            return (
              <Card
                key={card.id}
                index={i}
                id={card.id}
                text={card.text}
                showDivider={this.showDivider}
                setWillDropIndex={this.setWillDropIndex}
                willDropIndex={willDropIndex}
                dropCard={this.dropCard}
                parent={'cards1'}
                hoverClientY={hoverClientY}
              />
            );
          })}
        </div>
        <div style={style}>
          {cards2.map((card, i) => {
            return (
              <Card
                key={card.id}
                index={i}
                id={card.id}
                text={card.text}
                showDivider={this.showDivider}
                setWillDropIndex={this.setWillDropIndex}
                willDropIndex={willDropIndex}
                dropCard={this.dropCard}
                parent={'cards2'}
                hoverClientY={hoverClientY}
              />
            );
          })}
        </div>
        {willDropIndex !== null ?
          <div style={{ width: 345, height: 2, backgroundColor: '#7500f2', position: 'absolute', left: dividerX, top: dividerY }}></div>
          : null}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container);
