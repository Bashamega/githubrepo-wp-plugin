import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from 'rsuite/Loader';

// (Optional) Import component styles. If you are using Less, import the `index.less` file. 
import 'rsuite/Loader/styles/index.css';
import { Error } from './components/error';
import { Repo } from './components/card';
export default function Edit() {
	const [selected, select] = useState('option1');
	const [option1, setOption1] = useState('');
	const [option2, setOption2] = useState('');
	const [option3, setOption3] = useState('');
	const [option4, setOption4] = useState('');
	const [userInput, setUserInput] = useState('');
	const [data, setData] = useState({loading: false, error: false, apiData: null});

	const change = (e, func) => {
		const value = e.target.value;
		func(value);
	};

	useEffect(() => {
		switch (selected) {
			case 'option1':
				if (option1) {
					setData({loading: true, error: false});
					axios.get(`https://api.github.com/users/${option1}/repos`)
						.then(response => {
							setData({loading: false, error: false, apiData: response.data});
						})
						.catch(error => {
							console.log(error)
							setData({loading: false, error: true});
						});
				} else {
					setData({loading: false, error: true});
				}
				break;
			case 'option2':
				if (option2) {
					setData({loading: true, error: false});
				} else {
					setData({loading: false, error: true});
				}
				break;
			case 'option3':
				if (option3) {
					setData({loading: true, error: false});
				} else {
					setData({loading: false, error: true});
				}
				break;
			case 'option4':
				if (option4 && userInput) {
					setData({loading: true, error: false});
				} else {
					setData({loading: false, error: true});
				}
				break;
			default:
				setData({loading: false, error: true});
				break;
		}
	}, [option1, option2, option3, option4, userInput, selected]);

	return (
		<div className='gh-repo-plugin' { ...useBlockProps() }>
			<h2>Github Repo</h2>
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
						<label><br></br>
							<input type="radio" value="option3" checked={selected === 'option3'} onChange={() => select('option3')} />
							All repositories under a specific topic
						</label><br></br>
						{selected === 'option3' ? (
							<div>
								<label>Topic:</label><br></br>
								<input placeholder='Js' id='3' value={option3} onChange={(e) => change(e, setOption3)}></input>
							</div>
						) : null}
						<label><br></br>
							<input type="radio" value="option4" checked={selected === 'option4'} onChange={() => select('option4')} />
							
							All repositories under a specific topic owned by a specific user/org
							{selected === 'option4' ? (
								<div>
									<label>Topic:</label><br></br>
									<input placeholder='Js' id='4' value={option4} onChange={(e) => change(e, setOption4)}></input><br></br><br></br>
									<label>User Name:</label><br></br>
									<input placeholder='Bashamega' id='5' value={userInput} onChange={(e) => setUserInput(e.target.value)}></input>
								</div>
							) : null}
						</label><br></br>
					</div>
				</TabPanel>
				<TabPanel>
					{data.error && <Error/>}
					{data.loading && <Loader backdrop={true}/>}
					{data.apiData && data.apiData.length > 0 ? (
						<div className='github-cards'>
							{data.apiData.map((repo, index) => (
								<Repo data={repo}/>
							))}
						</div>
					) : !data.error? (
						<h2>No Public Repositories</h2>
					):(<></>)}
				</TabPanel>
			</Tabs>
		</div>
	);
}
