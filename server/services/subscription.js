let ballots = {};

const EventTypes = {
  NOMINATIONS_UPDATED: "NOMINATIONS_UPDATED",
  BALLOT_DELETED: "BALLOT_DELETED",
};

function subscribe(req, res) {
  const { ballotCode } = req.params;
  // Haders and http status to keep connection open
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no", // https://serverfault.com/questions/801628/for-server-sent-events-sse-what-nginx-proxy-configuration-is-appropriate
  };
  res.writeHead(200, headers);

  const data = `data: ${JSON.stringify({
    message: "Subscribed to event source",
  })}\n\n`;
  res.write(data);

  if (!ballots[ballotCode]) {
    ballots[ballotCode] = [];
  }

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };
  ballots[ballotCode].push(newClient);

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    ballots[ballotCode] = ballots[ballotCode].filter((c) => c.id !== clientId);
    if (ballots[ballotCode].length === 0) {
      let newBallots = Object.assign({}, ballots);
      delete newBallots[ballotCode];
      ballots = newBallots;
    }
  });
}

// Wrapper arround sendToClients function for single events without data
function notifyClients(ballotCode, event) {
  sendToClients(ballotCode, { event });
}

function sendToClients(ballotCode, data) {
  const clients = ballots[ballotCode];
  clients.forEach((client) =>
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  );
}

module.exports = {
  sendToClients,
  notifyClients,
  subscribe,
  EventTypes,
};
