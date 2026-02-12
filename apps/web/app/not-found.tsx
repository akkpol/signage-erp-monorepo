export default function NotFound() {
    return (
        <html lang="en">
            <body style={{
                backgroundColor: '#020617',
                color: '#f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontFamily: 'sans-serif'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
                <p>Page Not Found</p>
                <a href="/" style={{ color: '#00f2ff', marginTop: '2rem', textDecoration: 'none' }}>Go back home</a>
            </body>
        </html>
    );
}
