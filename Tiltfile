update_settings(max_parallel_updates=10)

# Load .env file for environment variables
load('ext://dotenv', 'dotenv')
dotenv()

v1alpha1.extension_repo(name='agentic-layer', url='https://github.com/agentic-layer/tilt-extensions', ref='v0.3.0')

v1alpha1.extension(name='cert-manager', repo_name='agentic-layer', repo_path='cert-manager')
load('ext://cert-manager', 'cert_manager_install')
cert_manager_install()

v1alpha1.extension(name='agent-runtime', repo_name='agentic-layer', repo_path='agent-runtime')
load('ext://agent-runtime', 'agent_runtime_install')
agent_runtime_install(version='0.9.0')

v1alpha1.extension(name='ai-gateway-litellm', repo_name='agentic-layer', repo_path='ai-gateway-litellm')
load('ext://ai-gateway-litellm', 'ai_gateway_litellm_install')
ai_gateway_litellm_install(version='0.2.0')

v1alpha1.extension(name='agent-gateway-krakend', repo_name='agentic-layer', repo_path='agent-gateway-krakend')
load('ext://agent-gateway-krakend', 'agent_gateway_krakend_install')
agent_gateway_krakend_install(version='0.1.4')


k8s_kind(
    '^Agent$',
    image_json_path='{.spec.image}',
    # Operator creates pods asynchronously after Agent CRD creation and Tilt
    # must wait for operator-managed pods rather than assuming immediate readiness
    pod_readiness='wait',
)

# Apply Kubernetes manifests
k8s_yaml(kustomize('deploy/local'))

# Expose services
k8s_resource('lgtm', port_forwards=['12000:3000'])
k8s_resource('ai-gateway-litellm', port_forwards=['12001:4000'])
k8s_resource('agent-gateway-krakend', port_forwards=['12002:8080'])
k8s_resource('observability-dashboard', port_forwards=['12004:8000'])
k8s_resource('claims-analysis-agent', port_forwards=['12011:8000'], labels=['agents'])

# Define Agents and MCP Servers
agents = [
    {'name': 'claims_voice_agent', 'port': '12010:8000'},
]

mcp_servers = [
    {'name': 'customer_database', 'port': '12020:8000'},
]

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
    )
    k8s_resource(snake_to_kebab(server_name), port_forwards=server['port'], labels=['mcp-servers'])

# Frontend deployment
docker_build(
    'showcase-claims-frontend',
    context='.',
    dockerfile='./frontend/Dockerfile',
)

# Port forwarding for frontend
k8s_resource('showcase-claims-frontend', port_forwards='12030:80', labels=['frontend'])

google_api_key = os.environ.get('GOOGLE_API_KEY', '')
if not google_api_key:
    fail('GOOGLE_API_KEY environment variable is required. Please set it in your shell or .env file.')

# Create Kubernetes secrets from environment variables
load('ext://secret', 'secret_from_dict')

k8s_yaml(secret_from_dict(
    name = "api-key-secrets",
    namespace = "showcase-insurance-claims",
    # The ai-gateway expects the API key to be called <provider>_API_KEY
    inputs = { "GEMINI_API_KEY": google_api_key }
))