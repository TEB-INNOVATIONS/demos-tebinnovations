import { db, ref, set, push, onValue, remove } from "./firebase.js";

// Generate random 3 digit work code
function generateCode() {
  return Math.floor(100 + Math.random() * 900);
}

/* ------------ Create Event (ADMIN) ------------ */
document.getElementById("btnCreate")?.addEventListener("click", () => {
  const code = generateCode();

  set(ref(db, "events/" + code), {
    place: document.getElementById("place").value,
    auditorium: document.getElementById("auditorium").value,
    wage: document.getElementById("wage").value,
    time: document.getElementById("time").value,
    code: code
  });

  alert("Event Created Successfully!");
  loadEvents();
});


/* ------------ Load Events + Responses Under Each Event (ADMIN) ------------ */
export function loadEvents() {
  const container = document.getElementById("eventList");
  if (!container) return;

  onValue(ref(db, "events"), snapshot => {
    container.innerHTML = "";

    snapshot.forEach(evSnap => {
      const e = evSnap.val();
      container.innerHTML += `
        <div class="col-md-6">
          <div class="card p-3 mb-3 shadow">
            <h4>${e.place} - ${e.auditorium}</h4>
            <p><b>Wage:</b> ₹${e.wage} | <b>Time:</b> ${e.time}</p>
            <span class="badge bg-primary">Work Code: ${e.code}</span>

            <h5 class="mt-3">Responses</h5>
            <div id="resp-${e.code}"></div>
          </div>
        </div>
      `;

      /* Load responses for this event */
      onValue(ref(db, "responses/" + e.code), resSnap => {
        const box = document.getElementById("resp-" + e.code);
        box.innerHTML = "";

        if (!resSnap.exists()) {
          box.innerHTML = "<p class='text-muted'>No responses yet</p>";
          return;
        }

        resSnap.forEach(uSnap => {
          const u = uSnap.val();
          box.innerHTML += `
            <div class="border p-2 mb-2 rounded">
              <b>${u.name}</b> (${u.role})<br>
              <b>Phone:</b> ${u.phone} | <b>${u.exp} yrs exp</b><br>
              <b>City:</b> ${u.city}<br>

              <button class="btn btn-success btn-sm mt-2"
                onclick="accept('${u.phone}', '${e.code}')">Accept</button>

              <button class="btn btn-danger btn-sm ms-2 mt-2"
                onclick="reject('${e.code}', '${uSnap.key}')">Reject</button>
            </div>
          `;
        });
      });
    });
  });
}
loadEvents();


/* ------------ User page events ------------- */
onValue(ref(db, "events"), snapshot => {
  const container = document.getElementById("userEventList");
  if (!container) return;

  container.innerHTML = "";
  snapshot.forEach(data => {
    const e = data.val();
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow p-3 mb-3">
          <h5>${e.place} - ${e.auditorium}</h5>
          <p>₹${e.wage} | ${e.time}</p>
          <button class="btn btn-success" onclick="openJoinForm(${e.code})">Join</button>
        </div>
      </div>`;
  });
});


/* ------------ Join Form Modal ------------- */
window.openJoinForm = function(code) {
  const modalHTML = `
  <div class="modal fade" id="joinModal">
    <div class="modal-dialog"><div class="modal-content p-4">
      <h4>Join for Work (Code ${code})</h4>
      <input id="fullName" class="form-control mt-2" placeholder="Full Name">
      <input id="dob" class="form-control mt-2" type="date">
      <input id="phone" class="form-control mt-2" placeholder="Phone Number">
      <input id="experience" class="form-control mt-2" placeholder="Experience (Years)">
      <select id="role" class="form-control mt-2">
        <option>Worker</option><option>Cleaner</option>
        <option>Sound System</option><option>Decoration</option>
      </select>
      <input id="city" class="form-control mt-2" placeholder="City">
      <button class="btn btn-primary mt-3" onclick="submitJoin(${code})">Submit</button>
    </div></div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  new bootstrap.Modal(document.getElementById("joinModal")).show();
};


/* ------------ Submit Join Form ------------- */
window.submitJoin = function(code) {
  const data = {
    name: document.getElementById("fullName").value,
    dob: document.getElementById("dob").value,
    phone: document.getElementById("phone").value,
    exp: document.getElementById("experience").value,
    role: document.getElementById("role").value,
    city: document.getElementById("city").value,
  };

  push(ref(db, "responses/" + code), data);
  alert("Submitted Successfully!");
  location.reload();
};


/* ------------ Accept & Reject ------------ */
window.accept = function(phone, code) {
  const message = `You are selected for the work (Code ${code})`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
};

window.reject = function(code, id) {
  remove(ref(db, `responses/${code}/${id}`));
  alert("Removed Successfully!");
};
