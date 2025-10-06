# Tiltfile for insurance claims showcase development

update_settings(max_parallel_updates=10)

# Cert manager is required for Agent Runtime Operator to support webhooks
load('ext://cert_manager', 'deploy_cert_manager')
deploy_cert_manager()

print("Installing agent-runtime-operator")
local("kubectl apply -f https://github.com/agentic-layer/agent-runtime-operator/releases/download/v0.2.3/install.yaml")

print("Waiting for agent-runtime-operator to start")
local("kubectl wait --for=condition=Available --timeout=60s -n agent-runtime-operator-system deployment/agent-runtime-operator-controller-manager")

# Configure Tilt to work with Agent Runtime Operator's custom Agent CRDs
# Without these configurations, Tilt cannot properly manage Agent resources created by the operator:
# image_json_path: Required because Agent CRDs store image references in a custom field ({.spec.image})
#                  rather than standard Kubernetes image fields that Tilt knows about by default
# pod_readiness: Required because the operator creates pods asynchronously after Agent CRD creation,
#                and Tilt must wait for operator-managed pods rather than assuming immediate readiness
k8s_kind(
    'Agent',
    image_json_path='{.spec.image}',
    pod_readiness='wait'
)

# Load .env file for environment variables
load('ext://dotenv', 'dotenv')
dotenv()

# Create Kubernetes secrets from environment variables
load('ext://secret', 'secret_from_dict')

google_api_key = os.environ.get('GOOGLE_API_KEY', '')
if not google_api_key:
    fail('GOOGLE_API_KEY environment variable is required. Please set it in your shell or .env file.')

k8s_yaml(secret_from_dict(
    name = "api-key-secrets",
    namespace = "ai-gateway",
    inputs = { "GEMINI_API_KEY": google_api_key }
))

k8s_yaml(secret_from_dict(
    name = "api-key-secrets",
    namespace = "showcase-insurance-claims",
    inputs = { "GEMINI_API_KEY": os.environ.get('GOOGLE_API_KEY') }
))

# Apply Kubernetes manifests
k8s_yaml(kustomize('deploy/local'))

# Define Agents and MCP Servers
agents = [
    {'name': 'claims_voice_agent', 'port': '8000:8000'},
]

mcp_servers = [
    {'name': 'customer_database', 'port': '8001:8000'},
]

# Live update configuration for faster development (note: this copies the whole project, not only the respective subfolder)
if agents or mcp_servers:
    live_update_sync = sync('.', '/app')

# Helper function to convert snake_case to kebab-case
def snake_to_kebab(snake_str):
    return snake_str.replace('_', '-')

# Open ports and sync changes to agents
for agent in agents:
    agent_name = agent['name']
    docker_build(
        agent_name,
        context='.',
        dockerfile='./agents/Dockerfile',
        build_args={'AGENT_NAME': agent_name},
        live_update=[live_update_sync],
    )
    k8s_resource(snake_to_kebab(agent_name), port_forwards=agent['port'], labels=['agents'])

# Open ports and sync changes to MCP servers
for server in mcp_servers:
    server_name = server['name']
    docker_build(
        server_name,
        context='.',
        dockerfile='./mcp-servers/Dockerfile',
        build_args={'MCP_SERVER_NAME': server_name},
        live_update=[live_update_sync],
    )
    k8s_resource(snake_to_kebab(server_name), port_forwards=server['port'], labels=['mcp-servers'])

# Frontend deployment
docker_build(
    'showcase-claims-frontend',
    context='.',
    dockerfile='./frontend/Dockerfile',
)

# Port forwarding for frontend
k8s_resource('showcase-claims-frontend', port_forwards='8080:80', labels=['frontend'])
