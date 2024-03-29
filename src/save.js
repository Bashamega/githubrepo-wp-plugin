import { Repo } from './components/card';
import { Error } from './components/error';
//import { Loader } from 'rsuite';
//import 'rsuite/Loader/styles/index.css';

const Save = (props) => {

	let filteredRepos = props.attributes.dataFetched?.apiData || [];
	let res = ""
	const searchRepos = (searchTerm) => {
		return props.attributes.dataFetched?.apiData ? props.attributes.dataFetched.apiData.filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];
	};

	const handleSearch = (event) => {
		res = event.target.value;
		filteredRepos = searchRepos(res);
		
	};

	return (
		<main className='gh-repo-plugin' >
			{props.attributes.dataFetched ? (
				<>
					{props.attributes.dataFetched.error && <Error/>}
					{props.attributes.dataFetched.apiData && props.attributes.dataFetched.apiData.length > 0 && filteredRepos.length > 0 ? (
						<section>
							<div className='github-cards'>
								{filteredRepos.map((repo, index) => (
									<div class="github-card">
										<Repo data={repo} key={index} />
									</div>
								))}
							</div>
						</section>
						
					) : !props.attributes.dataFetched.error ? (
						<h2>No Public Repositories</h2>
					) : null}
				</>
			) : (
				<Error/>
			)}
		</main>
	);
}

export default Save;
