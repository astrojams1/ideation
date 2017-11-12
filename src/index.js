import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     history: [
  //       {
  //         node: 
  //           {
  //             text: 'The seed of an idea so good it must be recorded here for your sake and for mine.',
  //             location: [],
  //             sub_nodes: Array(0),
  //           },
  //       }
  //     ],
  //     historyIndex: 0,
  //   };
  // }

  // const history = this.state.history;
  // const current = history[history.length - 1];
  // const nodes = [current.node, current.node, current.node];

  // sticky note
  // comment = node.

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.nix = this.nix.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      editing: false
    };
  }

  add() {
    console.log("clicked add on node " + this.props.index);
    this.props.addNode(this.props.index);
  }

  nix() {
    console.log("clicked nix on node " + this.props.index);
    this.props.nixNode(this.props.index);
  }

  edit() {
    console.log("clicked edit on node " + this.props.index);
    this.setState({editing: true});
  }

  save() {
    console.log("clicked save on node " + this.props.index);
    this.props.updateNode(this.refs.newText.value, this.props.index)
    this.setState({editing: false});
  }

  renderForm() {
    //this is where newText is introduced
    return(
      <div className="node">
        <textarea ref="newText" defaultValue = {this.props.node.text}></textarea>
        <button onClick={this.save}>Save</button>
      </div>
    );
  }

  renderNormal() {
    return(
      <div className="node">
        <p>{this.props.node.text}</p>
        <button onClick={this.add}>Add</button>
        <button onClick={this.edit}>Edit</button>
        <button onClick={this.nix}>Nix</button>
      </div>
    );
  }

  render() {
    //return html to display.
    //can only return 1 parent element
    //access props via this.props.
    if (this.state.editing) {
      return this.renderForm();
    } else {
      return this.renderNormal();
    }
  } 
}

class Cluster extends React.Component {
  constructor(props) {
    super(props);
    this.updateNode = this.updateNode.bind(this);
    this.addNode = this.addNode.bind(this);
    this.nixNode = this.nixNode.bind(this);
    this.eachNode = this.eachNode.bind(this);
    this.state = {
      nodes: [
        {
          text: 'The seed of an idea so good it must be recorded here for your sake and for mine.',
          parent_index: null,
          sub_nodes: Array(0),
        },
      ]
    }
  }

  addNode(i) {
    console.log("adding sub_node to node " + i);
    var arr = this.state.nodes;
    arr.push(
      {
        text: 'I am a new node.',
        parent_index: i,
        sub_nodes: Array(0),
      },
    );
    arr[i].sub_nodes.push(
      {
        text: 'I am a new node.',
        sub_nodes: Array(0),
      },
    );
    this.setState({nodes: arr});
  }

  nixNode(i) {
    console.log("nixing node " + i);
    var arr = this.state.nodes;
    arr.splice(i,1);
    this.setState({nodes: arr});
  }

  updateNode(newText, i) {
    console.log("updating node " + i);
    var arr = this.state.nodes;
    arr[i].text = newText;
    this.setState({nodes: arr});
  }

  eachNode(node, i) {
    return(
      <Node 
        key={i}
        index={i}
        node={node}
        updateNode = {this.updateNode}
        addNode = {this.addNode}
        nixNode = {this.nixNode}
      />
    );
  }

  render() {
    return(
      <div className="Cluster">
        {
          this.state.nodes.map(this.eachNode)
        }
      </div>
    );
  }
}

// ========================================


// ReactDOM.render(html, where?)
ReactDOM.render(
  // you can pass data from html parent to child via properties this.props
  // you can also pass whatever is inside the html with this.props.children
  <Cluster/>
  , document.getElementById('root')
);