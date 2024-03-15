import React, { useState } from 'react'; // Import React and useState hook
import { Repo } from './components/card';
import { Error } from './components/error';
//import { Loader } from 'rsuite';
//import 'rsuite/Loader/styles/index.css';

const Save = (props) => {
	const [searchTerm, setSearchTerm] = useState(''); // State for search term

	const handleSearch = (e) => {
		setSearchTerm(e.target.value); // Update search term state
	};

	return (
		<main className='gh-repo-plugin' >
			{props.attributes.dataFetched? (
				<>
					{props.attributes.dataFetched.error && <Error/>}
					{props.attributes.dataFetched.apiData && props.attributes.dataFetched.apiData.length > 0 ? (
						<section>
							<input placeholder='Search ...' className='gh-repo-search' onChange={handleSearch}></input> 
							<div className='github-cards'>
								{props.attributes.dataFetched.apiData.filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase())).map((repo, index) => ( // Filter based on search term
									<Repo data={repo} key={index}/>
								))}
							</div>
						</section>
						
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

export default Save;
