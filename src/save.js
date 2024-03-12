
import { Repo } from './components/card';
import { Error } from './components/error';
import { Loader } from 'rsuite';
import 'rsuite/Loader/styles/index.css';
export default function save(props) {

	return (
		<main className='gh-repo-plugin' >
			{props.attributes.dataFetched? (
				<>
					{props.attributes.dataFetched.error && <Error/>}
					{props.attributes.dataFetched.loading && <Loader backdrop={true}/>}
					{props.attributes.dataFetched.apiData && props.attributes.dataFetched.apiData.length > 0 ? (
						<div className='github-cards'>
							{props.attributes.dataFetched.apiData.map((repo, index) => (
								<Repo data={repo} key={index}/>
							))}
						</div>
					) : !props.attributes.dataFetched.error ? (
						<h2>No Public Repositories</h2>
					) : null}
				</>
			):(
				<Error/>
			)}
		</main>
	);
}
