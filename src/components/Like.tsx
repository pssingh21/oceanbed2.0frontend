import React from "react";

interface LikeProps {
  postId: string;
  likes: number;
  setLikes: (postId: string, likes: number) => void;
}

interface LikesState {
  likes: number;
  isPressing: boolean;
}

class Like extends React.Component<LikeProps, LikesState> {
  private t: NodeJS.Timeout;
  private start: number;

  constructor(props: LikeProps) {
    super(props);
    this.state = {
      likes: 0,
      isPressing: false,
    };
    this.t = setTimeout(() => "", 1000);
    this.start = 100;

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.repeat = this.repeat.bind(this);
    this.setLikes = this.setLikes.bind(this);
  }

  componentDidMount() {
    this.setState({ likes: this.props.likes });
  }

  onMouseUp() {
    this.setState({ isPressing: false });
    clearTimeout(this.t);
    this.start = 100;
    this.props.setLikes(this.props.postId, this.state.likes);
  }

  onMouseDown() {
    this.setState({ isPressing: true });
    this.repeat();
  }

  repeat() {
    this.setLikes();
    this.t = setTimeout(this.repeat, this.start);
    this.start = this.start / 2;
  }

  setLikes() {
    this.setState({ likes: this.state.likes + 1 });
  }

  render() {
    return (
      <button
        className="py-2 max-w-xs flex-grow px-2 py-1 bg-gray-200 font-bold uppercase text-xs text-black font-semibold rounded uppercase hover:bg-gray-200 focus:bg-gray-200"
        type="button"
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseUp}
        onMouseOut={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline fill-current text-indigo-500 h-5 mr-2"
          viewBox="0 0 24 24"
        >
          <path d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z" />
          {this.state.isPressing ? (
            <animateTransform
              attributeName="transform"
              type="scale"
              dur="0.5s"
              values="1; 1.5; 1.25; 1.5; 1.5; 1;"
              repeatCount="indefinite"
            ></animateTransform>
          ) : null}
        </svg>{" "}
        {this.state.likes}
      </button>
    );
  }
}

export default Like;
