import { useRouteError, Link } from 'react-router-dom'; // For React Router v6

const Error = () => {
  const error = useRouteError(); // Hook to get error details (React Router v6)

  let errorMessage = 'An unexpected error occurred.';
  if (error.status === 404) {
    errorMessage = 'An issue occuerd';
  } else if (error.status === 500) {
    errorMessage = 'Internal server error.';
  }
  else{
    errorMessage = 'Something is wrong...';
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Oops!</h1>
      <p>{errorMessage}</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/"><button className='btn btn-success'>Go to Home Page</button></Link>
    </div>
  );
};

export default Error;