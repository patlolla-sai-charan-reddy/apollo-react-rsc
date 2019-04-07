/* @jsx createElement */
import React from "react";
import { createElement } from "glamor/react";

export function MasterDetail({
	header,
	search,
	results,
	details,
	showDetails,
}) {
	return (
		<div
			css={{
				margin: "0 auto",
				width: "100%",
				overflow: "hidden",
				height: "100vh",
				display: "grid",
				gridTemplateRows: "min-content auto",
			}}>
			<h1 css={{ fontWeight: "bold", textTransform: "uppercase", padding: "40px 40px 0" }}>
				Movie Search
			</h1>
			<div
				css={[
					{
						width: 1000,
						position: "relative",
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gridTemplateRows: "36px auto",
						gridTemplateAreas: `
                        'search  details'
                        'results details'
                  `,
						transition: "transform 150ms ease-in-out",
						transform: "translateX(0%)",
						overflow: "hidden",
					},
					showDetails && {
						transform: "translateX(-50%)",
					},
				]}>
				<div css={{ padding: "10px 40px", width: "50%" }}>
					<div css={{ gridArea: "search" }}>{search}</div>
					<div
						css={{
							marginTop: 10,
							gridArea: "results",
							overflow: "auto",
						}}>
						{results}
					</div>
				</div>
        <div css={{ padding: "10px 40px", width: "60%" }}>
				<div
					css={{
						gridArea: "details",
						overflow: "auto",
					}}>
					{details}
				</div>
        </div>
			</div>
		</div>
	);
}

export function Search({ query, onQueryUpdate }) {
	return (
		<input
			css={{
				height: "25px",
				padding: "5px",
				width: "100%",
				border: "0",
				fontSize: 15,
				outline: 0,
				borderBottom: " 1px solid gray",
				marginBottom: 10,
			}}
			onChange={event => onQueryUpdate(event.target.value)}
			value={query}
		/>
	);
}

export function ResultView({ data, result, onActiveResultUpdate, isActive }) {
	const { config } = data;
	const size = config.images.poster_sizes[0];
	const baseURL =
		document.location.protocol === "https:"
			? config.images.secure_base_url
			: config.images.base_url;
	const width = parseInt(size.replace(/\w/, ""), 10);
	const height = width / 27 * 40;
	return (
		<button
			onClick={() => onActiveResultUpdate(result)}
			css={[
				{
					background: "transparent",
					textAlign: "start",
					display: "flex",
					width: "auto",
					outline: "none",
					border: "none",
					boxShadow: "1px 4px 8px 0 rgba(0,0,0,0.2)",
					cursor: "pointer",
					padding: 0,
					transition: "0.3s",
					margin: "10px 5px 10px 0px",
          paddingRight: "10px",
					borderRadius: "5px",
					":hover": { boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)" },
					":focus": { background: "lightblue" },
				},
				isActive && {
					background: "#f7f7f7",
          ":focus": { background: "#f7f7f7" },
				},
			]}>
			<div
				css={{
					display: "flex",
					flexGrow: 1,
					position: "relative",
				}}>
				<div css={{ width, height }}>
					{result.poster_path !== null && (
						<img
							src={`${baseURL}/${size}/${result.poster_path}`}
							css={{ padding: 0, margin: 0 }}
						/>
					)}
				</div>
				<h1
					css={{
						fontSize: 20,
						marginLeft: 20,
						marginBottom: 0,
						paddingTop: 10,
					}}>
					{result.title}
				</h1>
			</div>
		</button>
	);
}
