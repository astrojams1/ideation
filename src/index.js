import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.nix = this.nix.bind(this);
    this.save = this.save.bind(this);
  }

  add() {
    console.log("clicked add on node " + this.props.index);
    this.props.addNode(this.props.index);
  }

  nix() {
    console.log("clicked nix on node " + this.props.index);
    this.props.nixNode(this.props.index);
  }

  save() {
    var newText = this.refs.newText.innerText;
    this.props.updateNodeText(newText, this.props.index);
    if (newText === "") {
      this.nix();
    }
  }

  render() {
    if (!this.props.node.nixed) {
      return (
        <div className={"node depth-"+Math.min(3,this.props.node.depth)}>
          <p ref="newText" onBlur={this.save} contentEditable="true">{this.props.node.text}</p>
          <button onClick={this.add}>Add</button>
        </div>
      );
    } else {
      return null;
    }
  } 
}

class Cluster extends React.Component {
  constructor(props) {
    super(props);
    this.updateNodeText = this.updateNodeText.bind(this);
    this.addNode = this.addNode.bind(this);
    this.nixNode = this.nixNode.bind(this);
    this.eachNode = this.eachNode.bind(this);
    this.state = {
      nodes: [
        {
          depth: 0,
          text: 'The seed of a great idea ready to explode',
          nixed: false,
          parent_index: null,
          sibling_index: 0,
          sub_nodes: Array(0),
        },
      ]
    }
  }

  addNode(i) {
    console.log("adding sub_node to node " + i);
    var arr = this.state.nodes;
    // add the node to the array of nodes
    var newNode = {
      depth: arr[i].depth + 1,
      text: '',
      nixed: false,
      parent_index: i,
      sibling_index: arr[i].sub_nodes.length,
      sub_nodes: Array(0),
    }
    // add a new node to the array
    arr.push(newNode);
    // update the parent node with new child (which node the user clicked "add" from)
    arr[i].sub_nodes.push(newNode);
    // update the parents upstream with new node data until you hit the seed
    var sub_cluster = arr[i];
    var sub_cluster_parent_index = sub_cluster.parent_index;
    //loop until i reach the seed, whose parents index is null.
    while (sub_cluster_parent_index) {
      arr[sub_cluster_parent_index].sub_nodes[sub_cluster.sibling_index] = sub_cluster;
      //set up for the next round:
      sub_cluster = arr[sub_cluster_parent_index];
      sub_cluster_parent_index = sub_cluster.parent_index;
    }
    this.setState({nodes: arr});
  }

  nixNode(i) {
    console.log("nixing node " + i);
    var arr = this.state.nodes;
    arr[i].nixed = true;
    this.setState({nodes: arr});
  }

  updateNodeText(newText, i) {
    console.log("updating text for node " + i);
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
        updateNodeText = {this.updateNodeText}
        addNode = {this.addNode}
        nixNode = {this.nixNode}
      />
    );
  }

  render() {
    return(
      <div className="cluster">
        {this.state.nodes.map(this.eachNode)}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Cluster/>
  , document.getElementById('root')
);