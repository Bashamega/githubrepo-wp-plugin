import { __ } from '@wordpress/i18n';
import './editor.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Error } from './components/error';
import { Repo } from './components/card';

export default function Edit(props) {
	const [selected, select] = useState('option1');
	const [option1, setOption1] = useState('');
	const [option2, setOption2] = useState('');
	const [data, setData] = useState({loading: false, error: false, apiData: null});
	const [submitted, submit] = useState(false);

	

	useEffect(() => {
		submit(props.attributes.dataFetched ? true : false);
	}, []);
	useEffect(()=>{
		refetch()
	}, [option1, option2])
	
	

	const refetch = async () => {
		const d = await dataFetch();
		console.log(d);
		setData(d);
	};

	const dataFetch = () => {
		switch (selected) {
			case 'option1':
				if (option1) {
					return fetchData('option1', option1, `https://api.github.com/users/${option1}/repos`);
				} else {
					return { loading: false, error: true };
				}
			case 'option2':
				if (option2) {
					return fetchData('option2', option2, `https://api.github.com/orgs/${option2}/repos`);
				} else {
					return { loading: false, error: true };
				}
			default:
				return { loading: false, error: true };
		}
	};

	const fetchData = async (type, value, apiUrl) => {
		try {
			const response = await axios.get(apiUrl);
			props.setAttributes({ dataFetched: { loading: false, error: false, apiData: response.data } });
			props.setAttributes({ apiURL: apiUrl });
			props.setAttributes({
				info: {
					'type': type,
					'userName': type == 'option1'? value : null,
					'org': type == 'option2'? value : null
				}
			});
			return { loading: false, error: false, apiData: response.data };
		} catch (error) {
			console.log(error);
			return { loading: false, error: true, apiData: [] }; // Fix for the Uncaught TypeError
		}
	};

	const clear = () => {
		props.setAttributes({ dataFetched: null });
		props.setAttributes({ apiURL: null });
		props.setAttributes({
			info: {
				'type': null,
				'userName': null,
				'org': null
			}
		});
		submit(false);
	};

	return (
		<div className='gh-repo-plugin'>
			<h2>Github Repo</h2>
			{submitted ? (
				<section>
					<nav className='nav'>
						<button onClick={refetch}>Refetch</button>
						<button onClick={clear}>Clear</button>
					</nav>
					
					<main>
						{props.attributes.dataFetched.error && <Error />}
						{props.attributes.dataFetched.loading && <Loader backdrop={true} />}
						{props.attributes.dataFetched.apiData && props.attributes.dataFetched.apiData.length > 0 ? (
							<div className='github-cards'>
								{props.attributes.dataFetched.apiData.map((repo, index) => (
									<Repo data={repo} key={index} />
								))}
							</div>
						) : !props.attributes.dataFetched.error ? (
							<h2>No Public Repositories</h2>
						) : null}
					</main>
				</section>
			) : (
				<Tabs>
					<TabList>
						<Tab>Edit</Tab>
						<Tab>View</Tab>
					</TabList>
					<TabPanel>
						<h4>Edit</h4>
						<p>How do you want the data to be fetched?</p>
						<div className='checkboxes'>
							<label>
								<input type="radio" value="option1" checked={selected === 'option1'} onChange={() => select('option1')} />
								All repositories of a specific user
							</label><br></br>
							{selected === 'option1' ? (
								<div>
									<label>User Name:</label><br></br>
									<input placeholder='Bashamega' id='1' value={option1} onChange={(e) => setOption1(e.target.value)}></input>
								</div>
							) : null}
							<label><br></br>
								<input type="radio" value="option2" checked={selected === 'option2'} onChange={() => select('option2')} />
								All repositories of a specific organization
							</label><br></br>
							{selected === 'option2' ? (
								<div>
									<label>Github Org Name:</label><br></br>
									<input placeholder='Github' id='2' value={option2} onChange={(e) => setOption2(e.target.value)}></input>
								</div>
							) : null}
						</div>
					</TabPanel>
					<TabPanel>
						{data.error && <Error />}
						{data.apiData && data.apiData.length > 0 ? (
							<div className='github-cards'>
								{data.apiData.map((repo, index) => (
									<Repo data={repo} key={index} />
								))}
							</div>
						) : !data.error ? (
							<h2>No Public Repositories</h2>
						) : null}
					</TabPanel>
				</Tabs>
			)}
		</div>
	);
}
