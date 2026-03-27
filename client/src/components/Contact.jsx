import { useEffect, useState } from 'react';

export default function Contact({ listing, onClose, onSuccess }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) return;
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (listing?.userRef) {
      fetchLandlord();
    }
  }, [listing?.userRef]);

  const handleSend = () => {
    if (!message) {
      alert('Please enter a message');
      return;
    }

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${landlord.email}&su=${encodeURIComponent(
      `Regarding ${listing.name}`
    )}&body=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'width=600,height=600');

    setMessage('');

    onClose();   // ✅ close modal
    onSuccess(); // ✅ trigger success popup
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact{' '}
            <span className="font-semibold">{landlord.username}</span> for{' '}
            <span className="font-semibold">
              {listing.name.toLowerCase()}
            </span>
          </p>

          <textarea
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          />

          <button
            onClick={handleSend}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Send Message
          </button>
        </div>
      )}
    </>
  );
}