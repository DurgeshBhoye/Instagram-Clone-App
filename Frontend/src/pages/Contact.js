
const Contact = () => {
    return (
        <div className="d-flex align-items-center justify-content-center flex-column p-3 row m-3 mt-5">
            <h3 className="text-center text-uppercase mb-3 mt-5">Contact Us</h3>

            <div className="card col-md-6">


                <form className="d-flex flex-column p-4">
                    <label>Full Name</label>
                    <input type="text" placeholder="Name" className="p-2 mb-3" required/>
                    
                    <label>Contact No.</label>
                    <input type="text" placeholder="Phone Number" className="p-2 mb-3"/>
                    
                    <label>Email address</label>
                    <input type="email" placeholder="Email" className="p-2 mb-3" required/>
                    <p>We'll never share your email with anyone else.</p>

                    <label>When can we reach you?</label>
                    <select className="p-2 mb-3" defaultValue="none">
                        <option value="none" disabled>Choose...</option>
                        <option value="Best">Best</option>
                        <option value="Good">Good</option>
                        <option value="New">New</option>
                        <option value="Worth">Worth</option>
                    </select>

                    <label>Enter your query below</label>
                    <textarea cols="30" rows="2" placeholder="Query here..."></textarea>

                    <button type="submit" className="btn btn-primary mt-3">Submit</button>

                </form>
            </div>

        </div>
    )
}

export default Contact;