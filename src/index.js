/* @jsx createElement */
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { createElement } from "glamor/react";

import { ApolloProvider, Query } from "react-apollo";
import ApolloClient, { gql } from "apollo-boost";
import "glamor/reset";

import { css } from "glamor";

import { MasterDetail, Search, ResultView } from "./Layouts";
import { AsyncValue } from "./AsyncValue";

// or as raw css
css.insert(`
 body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
`);

const IMAGE_QUERY = gql`
	query Config {
		config {
			images {
				poster_sizes
				base_url
				secure_base_url
			}
		}
	}
`;

function Result(props) {
	return (
		<Query asyncMode query={IMAGE_QUERY}>
			{({ data }) => <ResultView {...props} data={data} />}
		</Query>
	);
}

const SEARCH_QUERY = gql`
	query GetMovies($query: String!) {
		movies(query: $query) {
			id
			title
			poster_path
		}
	}
`;

function Results({ query, onActiveResultUpdate, activeResult }) {
	if (query.trim() === "") return <h4>search for your favorite movie!</h4>;
	return (
		<Query asyncMode query={SEARCH_QUERY} variables={{ query }}>
			{({ data }) => (
				<div css={{ display: "flex", flexDirection: "column" }}>
					{data.movies
						.slice(0, 5)
						.map(result => (
							<Result
								key={result.id}
								result={result}
								onActiveResultUpdate={onActiveResultUpdate}
								isActive={
									activeResult !== null && activeResult.id === result.id
								}
							/>
						))}
				</div>
			)}
		</Query>
	);
}

function FullPoster({ movie }) {
	const path = movie.poster_path;
	if (path === null) return null;

	return (
		<Query asyncMode query={IMAGE_QUERY}>
			{({ data: { config } }) => {
				const size = config.images.poster_sizes[2];
				const baseURL =
					document.location.protocol === "https:"
						? config.images.secure_base_url
						: config.images.base_url;
				const width = size.replace(/\w/, "");
				const src = `${baseURL}/${size}/${movie.poster_path}`;
				return <img alt="" src={src} width={width} />;
			}}
		</Query>
	);
}

const MOVIE_QUERY = gql`
	query GetMovie($id: Int!) {
		movie(id: $id) {
			id
			title
			overview
			poster_path
		}
	}
`;
function MovieInfo({ movie, clearActiveResult }) {
	return (
		<Query asyncMode query={MOVIE_QUERY} variables={{ id: movie.id }}>
			{({ data: { movie } }) => (
				<Fragment>
					<FullPoster movie={movie} />
					<h2>{movie.title}</h2>
					<div>{movie.overview}</div>
				</Fragment>
			)}
		</Query>
	);
}

function Details({ result, clearActiveResult }) {
	return (
		<Fragment>
			<div>
				<button
					css={{
						border: "1px solid gray",
						backgroundColor: "white",
						color: "black",
						padding: "10px 20px",
						cursor: "pointer",
						marginBottom: 10,
					}}
					onClick={() => clearActiveResult()}>
					Back
				</button>
			</div>
			<MovieInfo movie={result} />
		</Fragment>
	);
}

class Movies extends React.Component {
	state = {
		query: "",
		activeResult: null,
	};
	onQueryUpdate = query => this.setState({ query });
	onActiveResultUpdate = activeResult => this.setState({ activeResult });
	clearActiveResult = () => this.setState({ activeResult: null });
	render() {
		const state = this.state;
		// WARNING: This is a temporary API because these
		// features aren't exposed by React yet
		return (
			<AsyncValue
				value={state}
				defaultValue={{ query: "", activeResult: null }}>
				{asyncState => (
					<MasterDetail
						search={
							<div>
								<Search
									query={state.query}
									onQueryUpdate={this.onQueryUpdate}
								/>
							</div>
						}
						results={
							<Results
								query={asyncState.query}
								onActiveResultUpdate={this.onActiveResultUpdate}
								activeResult={state.activeResult}
							/>
						}
						details={
							asyncState.activeResult && (
								<Details
									clearActiveResult={this.clearActiveResult}
									result={asyncState.activeResult}
								/>
							)
						}
						showDetails={asyncState.activeResult !== null}
					/>
				)}
			</AsyncValue>
		);
	}
}

ReactDOM.render(
	<ApolloProvider
		client={
			new ApolloClient({
				uri: "https://movie-database-graphql.herokuapp.com/graphql",
			})
		}>
		<Movies />
	</ApolloProvider>,
	document.getElementById("root"),
);
