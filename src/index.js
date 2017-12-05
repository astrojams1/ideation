/*
IDEATION APP

Author: James Thompson
Hosting: not hosted
Github: https://github.com/astrojams1/ideation-app

Todo:
- add lines
- improve creation ux
*/

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
    var node = this.props.node;
    var x_pos = 50 + node.xyt[0];
    var y_pos = 50 + node.xyt[1];
    if (node.parent_index != null) {
      var x_pos_parent = 50 + node.parent_node.xyt[0];
      var y_pos_parent = 50 + node.parent_node.xyt[1];
      var dx = x_pos - x_pos_parent;
      var dy = y_pos - y_pos_parent;
      var spoke_length = Math.sqrt((dx*dx)+(dy*dy));
      var spoke_angle = (dy >= 0) ? Math.acos(dx/spoke_length)*180/Math.PI : -Math.acos(dx/spoke_length)*180/Math.PI;
      var x_pos_spoke_center = (x_pos + x_pos_parent)/2;
      var y_pos_spoke_center = (y_pos + y_pos_parent)/2;
      var x_pos_spoke = x_pos_spoke_center - spoke_length/2;
      var y_pos_spoke = y_pos_spoke_center;
      console.log('x_pos '+ x_pos);
      console.log('y_pos '+ y_pos);
      console.log('x_pos_parent '+ x_pos_parent);
      console.log('y_pos_parent '+ y_pos_parent);
      console.log('spoke length '+ spoke_length);
      console.log('dx '+ dx);
      console.log('dy '+ dy);
      console.log('spoke angle '+ spoke_angle);
      console.log('x_pos_spoke '+ x_pos_spoke);
      console.log('y_pos_spoke '+ y_pos_spoke);
      if (!node.nixed) {
        return (
          <div>
            <div className="spoke" style={{
              left:(x_pos_spoke).toString()+'%',
              top:(y_pos_spoke).toString()+'%',
              transform:'rotate('+spoke_angle+'deg)',
              width:spoke_length.toString()+'%',
            }}></div>
            <div className={"node depth-"+Math.min(3,node.depth)} style={{left:x_pos.toString()+'%', top:y_pos.toString()+'%'}}>
                <p ref="newText" onBlur={this.save} contentEditable="true">{node.text}</p>
                <button onClick={this.add}>Add</button>
            </div>
          </div>
        );
      } else {
        return null;
      }
    } else {
      return(
        <div className={"node depth-"+Math.min(3,node.depth)} style={{left:x_pos.toString()+'%', top:y_pos.toString()+'%'}}>
            <p ref="newText" onBlur={this.save} contentEditable="true">{node.text}</p>
            <button onClick={this.add}>Add</button>
        </div>
      );
    }
  }
}

class Cluster extends React.Component {
  constructor(props) {
    super(props);
    this.addNode = this.addNode.bind(this);
    this.nixNode = this.nixNode.bind(this);
    this.eachNode = this.eachNode.bind(this);
    this.updateNodeText = this.updateNodeText.bind(this);
    this.state = {
      nodes: [
        {
          depth: 0,
          text: 'iii',
          nixed: false,
          parent_node: null,
          parent_index: null,
          sibling_index: 0,
          sub_nodes: Array(0),
          xyt: [0,0,0],
        },
      ],
      layout:
      {
        d1_offset: [20,20],
        d2_offset: [32,32],
        d3_offset: [40,40],
        d1_max: 10,
        d2_max: 22,
        d3_max: 10,
      }
    }
  }

  calculateNodePosition(i) {
    console.log("calculating sub-node position of " + i);
    var arr = this.state.nodes;
    var d1_offset = this.state.layout.d1_offset;
    var d2_offset = this.state.layout.d2_offset;
    if (arr[i].parent_index == null) { // check if parent is the seed
      console.log("parent is seed!")
      var t = arr[i].sub_nodes.length * (1/this.state.layout.d1_max) * Math.PI * 2;
      var x = d1_offset[0] * Math.cos(t);
      var y = d1_offset[1] * Math.sin(t);
    } else {
      console.log("parent is not seed!")
      var t_step = 1/this.state.layout.d2_max * Math.PI * 2;
      var t_parent = arr[i].xyt[2];
      var t_start = t_parent - (1 * t_step);
      var t = t_start + t_step * arr[i].sub_nodes.length;
      var x = d2_offset[0] * Math.cos(t);
      var y = d2_offset[1] * Math.sin(t);
    }
    console.log(arr[i]);
    console.log(x);
    console.log(y);
    console.log(t);
    return [x,y,t];
  }

  addNode(i) {
    console.log("adding sub_node to node " + i);
    var arr = this.state.nodes;
    // add the node to the array of nodes
    var newNode = {
      depth: arr[i].depth + 1,
      text: 'iii',
      nixed: false,
      parent_node: arr[i],
      parent_index: i,
      sibling_index: arr[i].sub_nodes.length,
      sub_nodes: Array(0),
      xyt: this.calculateNodePosition(i),
    }
    // update tree:
    arr.push(newNode); //add new node node to array
    arr[i].sub_nodes.push(newNode); // update parent node with new child.
    var sub_cluster = arr[i];
    var sub_cluster_parent_index = sub_cluster.parent_index;
    while (sub_cluster_parent_index) { // update upstream sub-clusters
      arr[sub_cluster_parent_index].sub_nodes[sub_cluster.sibling_index] = sub_cluster;
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
    var cluster_size = Math.min(window.innerWidth,window.innerHeight);
    return(
      <div className="cluster" style={{width:cluster_size, height:cluster_size}}>
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
