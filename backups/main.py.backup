
import networkx as nx
import matplotlib.pyplot as plt

# Create an empty network graph
G = nx.Graph()

# Add network devices
G.add_node("R1", type="Router")
G.add_node("S1", type="Switch")
G.add_node("S2", type="Switch")
G.add_node("PC1", type="End Device")
G.add_node("PC2", type="End Device")
G.add_node("PC3", type="End Device")

# Add connections between devices
G.add_edges_from([
    ("R1", "S1"),
    ("R1", "S2"),
    ("S1", "PC1"),
    ("S1", "PC2"),
    ("S2", "PC3")
])

# Display network information
print("Devices in the Network:")
for device, data in G.nodes(data=True):
    print(device, "-", data["type"])

print("\nConnections:")
for device1, device2 in G.edges():
    print(device1, "<-->", device2)

# Define device colors
colors = []

for device in G.nodes():
    device_type = G.nodes[device]["type"]

    if device_type == "Router":
        colors.append("tomato")
    elif device_type == "Switch":
        colors.append("cornflowerblue")
    else:
        colors.append("lightgreen")

# Generate topology layout
pos = nx.spring_layout(G, seed=42)

# Draw the network topology
nx.draw(
    G,
    pos,
    with_labels=True,
    node_color=colors,
    node_size=2200,
    font_size=10,
    font_weight="bold",
    edge_color="black",
    width=1.5
)

plt.title("Network Topology Visualization")
plt.show()
