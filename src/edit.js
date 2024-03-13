import { __ } from '@wordpress/i18n';
import './editor.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
//import { Loader } from 'rsuite';
// (Optional) Import component styles. If you are using Less, import the `index.less` file. 
import 'rsuite/Loader/styles/index.css';
import { Error } from './components/error';
import { Repo } from './components/card';
export default function Edit(props) {
	const [selected, select] = useState('option1');
	const [option1, setOption1] = useState('');
	const [option2, setOption2] = useState('');
	const [userInput, setUserInput] = useState('');
	const [data, setData] = useState({loading: false, error: false, apiData: null});
	const [submitted, submit] = useState(false);
	const change = (e, func) => {
		const value = e.target.value;
		func(value);
	};
	useEffect(() => {
		if(props.attributes.dataFetched){
			submit(true);
		}
	}, []);
	useEffect(() => {
		refetch();
	}, [option1, option2, userInput, selected]);
	const refetch = () => {
		switch (selected) {
			case 'option1':
				if (option1) {
					setData({loading: true, error: false});
					let apiUrl = '';
					if(submitted){
						apiUrl = `https://api.github.com/users/${props.attributes.info.userName}/repos`;
					}else{
						apiUrl = `https://api.github.com/users/${option1}/repos`;
					}
					axios.get(apiUrl)
						.then(response => {
							setData({loading: false, error: false, apiData: response.data});
							props.setAttributes({dataFetched: {loading: false, error: false, apiData: response.data}});
							props.setAttributes({apiURL: apiUrl});
							props.setAttributes({info: {
								'type': selected,
								'userName': option1,
								'org': null,
								'topic': null
							}});
						})
						.catch(error => {
							console.log(error);
							setData({loading: false, error: true});
						});
				} else {
					setData({loading: false, error: true});
				}
				break;
			case 'option2':
				if (option2) {
					setData({loading: true, error: false});
					let apiUrl = '';
					if(submitted){
						apiUrl = `https://api.github.com/orgs/${props.attributes.info.org}/repos`;
					}else{
						apiUrl = `https://api.github.com/orgs/${option2}/repos`;
					}
					axios.get(apiUrl)
						.then(response => {
							setData({loading: false, error: false, apiData: response.data});
							props.setAttributes({dataFetched: {loading: false, error: false, apiData: response.data}});
							props.setAttributes({apiURL: apiUrl});
							props.setAttributes({info: {
								'type': selected,
								'userName': null,
								'org': option2,
								'topic': null
							}});
						})
						.catch(error => {
							console.log(error);
							setData({loading: false, error: true});
						});
				} else {
					setData({loading: false, error: true});
				}
				
				break;
			default:
				setData({loading: false, error: true});
				break;
		}
	};
	const clear = () => {
		props.setAttributes({dataFetched: null});
		props.setAttributes({apiURL: null});
		props.setAttributes({info: {
			'type': null,
			'userName': null,
			'org': null,
			'topic': null
		}});
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
									<input placeholder='Bashamega' id='1' value={option1} onChange={(e) => change(e, setOption1)}></input>
								</div>
							) : null}
							<label><br></br>
								<input type="radio" value="option2" checked={selected === 'option2'} onChange={() => select('option2')} />
								All repositories of a specific organization
							</label><br></br>
							{selected === 'option2' ? (
								<div>
									<label>Github Org Name:</label><br></br>
									<input placeholder='Github' id='2' value={option2} onChange={(e) => change(e, setOption2)}></input>
								</div>
							) : null}
						</div>
					</TabPanel>
					<TabPanel>
						{data.error && <Error/>}
						{data.apiData && data.apiData.length > 0 ? (
							<div className='github-cards'>
								{data.apiData.map((repo, index) => (
									<Repo data={repo} key={index}/>
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
