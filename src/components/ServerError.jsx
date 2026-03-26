import React from 'react'

const ServerError = () => {
  const handleRefresh = () => {
  window.location.reload();
};

<button onClick={handleRefresh}>
  Refresh Page
</button>
  return (
    <div style={{margin:"auto",justifyContent:"center"}}>
            <h3> Sorry Server Not Found</h3>
            {/* <button onClick={handleRefresh}>Refresh Page</button> */}
    </div>
  )
}

export default ServerError
